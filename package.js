Package.describe({
  summary: "Job Queue provides a simple to use job queue.",
  // Version number.
  version: "0.1.1",
  // Optional.  Default is package directory name.
  name: "steeve:job-queue",
  // Optional github URL to your source repository.
  git: "https://github.com/stephentcannon/job-queue.git"
});

Package.onUse(function (api) {
  
  api.use('mongo@1.0.8');
  
  api.addFiles([
    'lib/Jobqueue.js',
    ], ['server', 'client']);

  api.addFiles([
    'server/jobqueue.js',
    ], 'server');
  
  api.export('Jobqueue', ['server', 'client']);
  
  api.export('Jobqueueprocessor', 'server');
});
