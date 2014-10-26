jobqueue
========
a simple server side job que

usage
=====

Start processing jobs
======================
  ````
  var myjobprocessor = new Jobqueueprocessor(name, interval);
  ````
name is the name of the queue to listen to this allows you to write to a queue on one server or application and listen and process the queue on another server or application

interval is how often to check for scheduled tasks

Add a job
=========

````
  Jobqueue.add({
    name: name of queue for a processor,
    object: name of the object to handle the job,
    method: name of the method on the object to process the job,
    * add any other fields you want that your job will handle
  });
````

Schedule a job
===============

````
  Jobqueue.add({
    name: name of queue for a processor,
    object: name of the object to handle the job,
    method: name of the method on the object to process the job,
    when: date/time when to run
    * add any other fields you want that your job will handle
  });
````

    
Process a job
=============

````
  Object.method(job, callback)

  // do something
  
  callback(job._id); // to destroy job when done or use Jobqueue.remove
````

Reschedule a job
===================

````
  Jobqueue.reschedule(job, milliseconds);
````
 in = milliseconds.  don't worry when will be reset by adding in to now.

Job states
============
  unprocessed == waiting for a queue processor to process it
  processed == processed must be removed
  scheduled == future job

Populate some job data
=======================
````
console.log('restarted at: ' + new Date());
JobqueueTester = {};

JobqueueTester.testJob = function(job, callback){
  console.log('JobqueueTester.testJob');
  console.log(job);
  // callback(job._id);

};

JobqueueTester.testScheduledJob = function(job, callback){
  console.log('JobqueueTester.testScheduledJob');
  console.log(job);
  console.log('I am rescheduling the job at: ' + new Date());
  var x = new Date().valueOf();
  job['newThing' + x] = 'Added a new thing to a job before rescheduling at: ' + new Date();
  Jobqueue.reschedule(job, 5000);
  callback(job._id);
};

Jobqueue.add({
  name: 'acp',
  object: 'JobqueueTester',
  method: 'testJob',
  myThing: 'this is an immediate job'
});

var x = new Date();
x.setMilliseconds(x.getMilliseconds() + 5000);

Jobqueue.schedule({
  name: 'acp',
  object: 'JobqueueTester',
  method: 'testScheduledJob',
  when: x,
  myThing: 'this is a scheduled job for: ' + x
});
````
  




