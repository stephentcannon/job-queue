Jobqueue = new Meteor.Collection('jobqueue');

Jobqueue.fields = ['_id', 'createdAt', 'name', 'state', 'object', 'method', 'when'];

Jobqueue.validateDates = function(start_date, end_date){

	if(!moment(start_date).isValid()){
		throw 'Invalid start date.';
	}

	if(!moment(end_date).isValid()){
		throw 'Invalid end date.';
	}
};