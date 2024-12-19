Ext.define('App.<%= location %>.<%= name %>', {
    extend: 'App.store.AbstractStore',

    alias: 'store.<%= xtype %>',
    storeId: '<%= xtype %>',

    model: 'App.model.<%= module %>.<%= modelName %>',
    autoLoad: false,
    remoteSort: true,

    sorters: [
        new Ext.util.Sorter({
            property: 'name',
            direction: 'ASC'
        })
    ],

    proxy: {
        type: 'customrest',
        simpleSortMode: true,
        url: '',
        reader: {
            type: 'json',
            rootProperty: 'records',
            totalProperty: 'totalCount'
        }
    }
});
