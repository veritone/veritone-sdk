//function validateApplication(application) {
//	if (typeof application !== 'object') {
//		throw new Error('Missing application!');
//	}
//	var validation = {
//		applicationName: {
//			presence: true
//		},
//		contact: {
//			presence: true
//		},
//		'contact.name': {
//			presence: true
//		},
//		'contact.emailAddress': {
//			presence: true,
//			email: true
//		}
//	};
//	var validationErrors = validatejs(application, validation);
//	if (validationErrors) {
//		throw new Error('Invalid application object!');
//	}
//}
//
