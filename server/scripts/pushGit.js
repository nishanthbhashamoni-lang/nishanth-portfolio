import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';

const rootDir = path.resolve('.');

export async function pushToRemote(remoteUrl, token = '') {
  console.log(`Setting remote origin: ${remoteUrl}`);

  // 1. Add / Update Remote
  try {
    await git.deleteRemote({ fs, dir: rootDir, remote: 'origin' });
  } catch (e) {}

  await git.addRemote({
    fs,
    dir: rootDir,
    remote: 'origin',
    url: remoteUrl,
    force: true
  });

  const remotes = await git.listRemotes({ fs, dir: rootDir });
  console.log('Configured remotes:', remotes);

  console.log(`Pushing branch 'main' to ${remoteUrl}...`);

  const pushResult = await git.push({
    fs,
    http,
    dir: rootDir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token || process.env.GITHUB_TOKEN || 'git',
      password: token || process.env.GITHUB_TOKEN || ''
    })
  });

  console.log('✓ Push response:', pushResult);
  return pushResult;
}

// If executed directly with args
if (process.argv[2]) {
  const url = process.argv[2];
  const tok = process.argv[3] || '';
  pushToRemote(url, tok)
    .then(() => console.log('✓ Push completed successfully!'))
    .catch((err) => {
      console.error('Push failed:', err.message);
      process.exit(1);
    });
}