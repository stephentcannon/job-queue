Package.describe({
  summary: "Job Queue provides a simple to use job queue."
});

Package.on_use(function (api) {

  api.add_files([
    'server/jobqueue.js',
    ], 'server');
    
});