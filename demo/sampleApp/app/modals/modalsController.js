new function(){
	var sampleApp = new base2.Package(this, {
		name:    'sampleApp',
		imports: 'miruken.mvc',
		exports: 'ModalsController'
	});

	eval(this.imports);

	var ModalsController = Controller.extend({
		showModal: function () {
            var viewModal = {
                templateUrl: 'app/modals/modalContent.html',
                controller:  'ModalContentController as vm'
            };
            ViewRegion(this.context
            	.modal({
            		title: 'Hooray!', 
            		wrap: true	}))
            .present(viewModal).then(function(controller){
            	alert(controller.message);
            });
		}
	});

	eval(this.exports);
    
}
