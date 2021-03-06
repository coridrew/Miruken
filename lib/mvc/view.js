var miruken = require('../miruken.js');
              require('../callback.js');
              require('../context.js');
              require('../validate');
              require('./model.js');

new function () { // closure

    /**
     * Package providing Model-View-Controller abstractions.<br/>
     * Requires the {{#crossLinkModule "miruken"}}{{/crossLinkModule}},
     * {{#crossLinkModule "callback"}}{{/crossLinkModule}},
     * {{#crossLinkModule "context"}}{{/crossLinkModule}} and 
     * {{#crossLinkModule "validate"}}{{/crossLinkModule}} modules.
     * @module miruken
     * @submodule mvc
     * @namespace miruken.mvc
     */
    miruken.package(this, {
        name:    "mvc",
        imports: "miruken,miruken.callback",
        exports: "ViewLayer,ViewRegion,ViewRegionAware,PresentationPolicy," +
                 "RegionPolicy,ModalPolicy,ModalProviding,ButtonClicked"
    });

    eval(this.imports);

    /**
     * Protocol for representing a layer in a 
     * See {{#crossLink "miruken.mvc.ViewRegion"}}{{/crossLink}.
     * @class ViewLayer
     * @extends Protocol
     */
    var ViewLayer = Protocol.extend(Disposing, {
        /**
         * Gets the index of the layer in the region.
         * @property {int} index
         */
        get index() {}
    });
    
    /**
     * Protocol for rendering a view on the screen.
     * @class ViewRegion
     * @extends StrictProtocol
     */
    var ViewRegion = StrictProtocol.extend({
        /**
         * Renders `view` in the region.
         * @method show
         * @param    {Any}      view  -  view
         * @returns  {Promise}  promise for the layer.
         */
        show: function (view) {}
    });

    /**
     * Protocol for communicating
     * {{#crossLink "miruken.callback.CallbackHandler"}}{{/crossLink}} lifecycle.
     * @class ViewRegionAware
     * @extends Protocol
     */
    var ViewRegionAware = Protocol.extend({
        viewRegionCreated: function (viewRegion) {}
    });
    
    /**
     * Base class for presentation policies.
     * @class PresentationPolicy
     * @extends miruken.mvc.Model
     */
    var PresentationPolicy = Model.extend();

    /**
     * Policy for describing modal presentation.
     * @class ModalPolicy
     * @extends miruken.mvc.PresentationPolicy
     */
    var ModalPolicy = PresentationPolicy.extend({
        $properties: {
            title:      "",
            style:      null,
            chrome:     true,
            header:     false,
            footer:     false,
            forceClose: false,
            buttons:    null
        }
    });

    /**
     * Policy for controlling regions.
     * @class RegionPolicy
     * @extends miruken.mvc.PresentationPolicy
     */
    var RegionPolicy = PresentationPolicy.extend({
        $properties: {
            tag:   undefined,
            push:  false,
            modal: undefined
        }
    });
    
    /**
     * Represents the clicking of a button.
     * @class ButtonClicked
     * @constructor
     * @param  {Any}     button       -  clicked button
     * @param  {number}  buttonIndex  -  index of clicked button 
     * @extends Base
     */
    var ButtonClicked = Base.extend({
        constructor: function (button, buttonIndex) {
            this.extend({
                /**
                 * Gets the clicked button.
                 * @property {Any} button
                 */
                get button() { return button; },
                /**
                 * Gets the clicked button index.
                 * @property {number} button index
                 */
                get buttonIndex() { return buttonIndex; }
            });
        }
    });

    /**
     * Protocol for interacting with a modal provider.
     * @class ModalProviding
     * @extends StrictProtocol
     */
    var ModalProviding = StrictProtocol.extend({
        /**
         * Presents the content in a modal dialog.
         * @method showModal
         * @param   {Element}                  container  -  element modal bound to
         * @param   {Element}                  content    -  modal content element
         * @param   {miruken.mvc.ModalPolicy}  policy     -  modal policy options
         * @param   {miruken.context.Context}  context    -  modal context
         * @returns {Promise} promise representing the modal result.
         */
        showModal: function (container, content, policy, context) {}
    });
    
    CallbackHandler.implement({
        /**
         * Applies the presentation policy to the handler.
         * @method presenting
         * @returns {miruken.callback.CallbackHandler} presenting handler.
         * @for miruken.callback.CallbackHandler
         */
        presenting: function (policy) {
            return policy ? this.decorate({
                $handle: [PresentationPolicy, function (presenting) {
                    return policy.mergeInto(presenting);
                }]
            }) : this;
        },
        /**
         * Targets the tagged region with `tag`.
         * @method region
         * @param  {Any}  tag  -  region tag
         * @returns {miruken.callback.CallbackHandler} tag handler.
         * @for miruken.callback.CallbackHandler
         */                                                                
        region: function (tag) {
            return this.presenting(new RegionPolicy({tag: tag}));
        },
        /**
         * Presents the next view in a new layer. 
         * @method pushLayer
         * @returns {miruken.callback.CallbackHandler} push handler.
         * @for miruken.callback.CallbackHandler
         */                                                                
        pushLayer: function () {
            return this.presenting(new RegionPolicy({push: true}));
        },
        /**
         * Configures modal presentation options.
         * @method modal
         * @param {Object}  options  -  modal options
         * @returns {miruken.callback.CallbackHandler} modal handler.
         * @for miruken.callback.CallbackHandler
         */
        modal: function (modal) {
            return this.presenting(new RegionPolicy({
                modal: new ModalPolicy(modal)
            }));
        }        
    });
    
    eval(this.exports);
    
}
