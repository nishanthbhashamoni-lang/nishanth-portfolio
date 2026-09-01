import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';

const rootDir = path.resolve('.');

async function prepareGit() {
  console.log('--- Preparing Git Repository ---');

  // 1. Check or initialize repo
  const gitDir = path.join(rootDir, '.git');
  const repoExists = fs.existsSync(gitDir);
  if (!repoExists) {
    await git.init({ fs, dir: rootDir, defaultBranch: 'main' });
    console.log('✓ Initialized new Git repository on branch main.');
  } else {
    console.log('✓ Existing Git repository detected.');
  }

  // 2. Scan and list all files in directory tree
  function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');

      // Skip root .git folder from traversal
      if (relPath === '.git' || relPath.startsWith('.git/')) continue;

      if (stat.isDirectory()) {
        getFiles(filePath, fileList);
      } else {
        fileList.push(relPath);
      }
    }
    return fileList;
  }

  const allFiles = getFiles(rootDir);
  console.log(`Total files found: ${allFiles.length}`);

  // 3. Filter files based on git ignore rules
  const trackedFiles = [];
  const ignoredFiles = [];

  for (const file of allFiles) {
    const isIgnored = await git.isIgnored({
      fs,
      dir: rootDir,
      filepath: file
    });

    if (isIgnored) {
      ignoredFiles.push(file);
    } else {
      trackedFiles.push(file);
    }
  }

  console.log(`Ignored files count: ${ignoredFiles.length}`);
  console.log(`Tracked files count: ${trackedFiles.length}`);

  // 4. Verify no secret or env files are in tracked files list
  const dangerousPatterns = [
    /^\.env$/,
    /^\.env\.local$/,
    /^\.env\.development$/,
    /^\.env\.production$/,
    /\.db$/,
    /\.sqlite$/,
    /server\/uploads\/(?!.*\.gitkeep$).+/,
    /server\/data\/(?!.*\.gitkeep$).+/
  ];

  const leaks = trackedFiles.filter(f => dangerousPatterns.some(p => p.test(f)));
  if (leaks.length > 0) {
    console.error('❌ SECURITY ERROR: Leaked sensitive files found in tracked list:', leaks);
    process.exit(1);
  } else {
    console.log('✓ Security Check: 0 sensitive or database files in tracked files list.');
  }

  // 5. Stage all tracked files
  for (const file of trackedFiles) {
    await git.add({
      fs,
      dir: rootDir,
      filepath: file
    });
  }
  console.log(`✓ Successfully staged ${trackedFiles.length} source files.`);

  // 6. Create Commit
  const commitHash = await git.commit({
    fs,
    dir: rootDir,
    message: 'Initial commit: Nishanth Bhashamoni Personal Portfolio & Secure Admin System',
    author: {
      name: 'Nishanth Bhashamoni',
      email: 'nishanth@portfolio.local'
    }
  });

  console.log('====================================================');
  console.log(`✓ Commit created successfully!`);
  console.log(`Commit Hash: ${commitHash}`);
  console.log('====================================================');

  // 7. Check Status
  const statusMatrix = await git.statusMatrix({
    fs,
    dir: rootDir,
    filter: (f) => !f.startsWith('node_modules') && !f.startsWith('dist')
  });

  const statusSummary = {
    repoStatus: 'Clean (All tracked files committed)',
    commitHash: commitHash,
    trackedFilesCount: trackedFiles.length,
    trackedFiles: trackedFiles,
    ignoredFilesCount: ignoredFiles.length
  };

  return statusSummary;
}

prepareGit()
  .then((summary) => {
    console.log('Git Preparation complete.');
  })
  .catch((err) => {
    console.error('Git Preparation failed:', err);
    process.exit(1);
  });