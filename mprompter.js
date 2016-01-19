/*
 * jQuery MantellaPrompter (mPropmter) v.1. plugin
 * Copyright (c) 2013 Vasilij Olhov
*/

;(function($) {

    // ================================================
    // =============== DEFAULT OPTIONS ================
    // ================================================
    var defaults = {
        symbols		: 3,
        height		: 200,
        item		: '{name}',
        value		: '{name}',
        query_url	: './search.php',
        query_param	: 'q',
        params 		: {},
        onQuery		: null,
        onSuccess	: null,
        onError		: null,
        onSelect	: null
	};

    // ================================================
    // =============== EXTERNAL METHODS ===============
    // ================================================
    var methods = {

        // === Initailization ===
        init: function(params) {

            var options = $.extend(true, {}, defaults, params);
            this.data('options',options);	// gloabal options

            this.wrap("<div class='mprompter-container'></div>" );

        	// add list-container after text-field
        	var offset = this.offset(),
        		list = $('<div class="mprompter-list"></div>').insertAfter( this )
        	list.css('width', this.outerWidth() - (list.outerWidth(true)-list.width()) )
        		.css('top', this.outerHeight(true) );
        	this.data('list', list); 		// list elemant
            this.data('items', [] );		// founded items
            this.data('query', "");			// search string

            // set events for plugin
            bindActions.call(this);

            return this;
        }

    };





    // =================================================
    // ================ AJAX REQUEST HANDLE ============
    // =================================================
    var _request = function(query_string) {
        var me		= this,
        	options = me.data('options'),
        	query	= {},
        	data	= {};
        query[ options.query_param ] = query_string;
        data 	= $.extend( query , options.params);

        // prepare for new search
        _setProgress.call(me, true);
        me.data('query',query_string)
        me.data('items', [] );
        me.data('overlist',false);

        if (options.onQuery) { options.onQuery.call( me, data ); }

        // do request
        $.ajax({
                 type:        "GET",
                 url:         options.query_url,
                 dataType:    "json",
                 data:        data,
                 complete:	  function() { _setProgress.call(me,false); },
                 success:     function(response) {
                 				if ( !response.success ) {
                                	if(options.onError) { options.onError.call( me, response.message ); }
                                    return;
                                }
                                if (options.onSuccess) { options.onSuccess.call( me, response.message, response.data ); }
                                var items = [];
                                for(var i=0; i<response.data.length; i++) { items.push( response.data[i] ); }
                                me.data('items', items);
                                _buildItemsList.call(me);
                 },
                 error :      function( xhr, status, error ) {                              	if(options.onError) { options.onError.call( me, error ); }
        		 }
        });


    };





    // =================================================
    // ================= BUILD FUNCTIONS ===============
    // =================================================
    var _buildItemsList = function() {    	var options = this.data('options'),
    		items	= this.data('items'),
    		list	= this.data('list'),
    		query	= this.val();

		list.empty();
        list.css('height','auto');

        var item, decorated, reg, valid = false;
        for(var i=0; i<items.length; i++) { // all items        	item = items[i];
        	valid = false;
        	for(var prop in item) { // all fields in item
    			reg = new RegExp( query, 'ig' );
    			if ( reg.test(item[prop]) ) {
                    valid = true;
    				break;
    			}
        	}
        	if (valid) {
        		decorated = JSON.parse(JSON.stringify(item)); // cloen item object
        		for(var prop in decorated) {         			decorated[prop] = decorated[prop].toString().replace(reg , '<hl>'+query+'</hl>' );
        		}
        		list.append( _buildItem.call(this, item, decorated) );
        	}

        	if (list.height() > options.height) { list.height(options.height); }
        }
        _showList.call(list);

    };


	var _buildItem = function( original, item ) {		var me = this,
			content	= me.data('options').item,
			reg,
			div;
        for(var prop in item) {
        	reg = new RegExp( '{'+prop+'}', 'ig' );
            content = content.replace( reg, item[prop] );
        }
        div = $('<div class="mprompter-item">'+content+'</div>');
		div.data(original);

        div.on('click', function(event) {
			var options = me.data('options');
            _setSelectedValue.call(me, $(this).data() );
			_hideList.call(me.data('list'));

		});

        return div;
	};


    var _setSelectedValue = function( item ) {    	var options = this.data('options'),
    		content	= options.value,
    		reg;

        for(var prop in item) {
        	reg = new RegExp( '{'+prop+'}', 'ig' );
            content = content.replace( reg, item[prop] );
        }
        this.val(content);
        if(options.onSelect) { options.onSelect.call( this, item ); }    }




    // =================================================
    // ================ BIND ACTIONS ===================
    // =================================================
    var bindActions = function() {
		var me = this,
			options = me.data('options'),
			list = me.data('list');

		me.on('keyup', function(event) {			var value 	= me.val(),
				query	= value.substring(0, options.symbols);

			if ( value.length < options.symbols ) {
				me.data('items', [] );
				me.data('query', '');
				list.hide();
				return;
			}            else {            	if ( query == me.data('query') ) { _buildItemsList.call(me); }
            	else { _request.call(me, query ); }
            }
		})
		.on('focusin', function(event) {			if ( list.text().length > 0 ) { _showList.call(list); }		})
		.on('focusout', function(event) {
			if (!me.data('overlist')) { _hideList.call(list); }
		});

		list.on('mouseenter', function(event) { me.data('overlist',true); })
			.on('mouseleave', function(event) { me.data('overlist',false); });

	};




    // =================================================
    // ================ HELPER FUNCTIONS ===============
    // =================================================
    var _hideList = function() {    	this.fadeOut(150);    }

    var _showList = function() {
    	this.fadeIn(200);
    }

    var _setProgress = function( isBusy ) {
		if (isBusy) { this.addClass('mprompter-progress'); }
		else { this.removeClass('mprompter-progress'); }
		this.prop('disabled', isBusy);
    };




    // =================================================
    // ============ EXTERNAL ENTRY POINT ===============
    // =================================================
    $.fn.mPrompter = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) { return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 )); }
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) { return methods.init.apply( this, arguments ); }
        else { return false; }
    };

})(jQuery);
