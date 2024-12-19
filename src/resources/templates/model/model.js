Ext.define('App.<%= location %>.<%= name %>', {
    extend: 'App.model.Base',

    fields: [
        {
            name: 'id',
            type: 'int',
            allowNull: true,
            defaultValue: null
        }
        // Add model definitions here
    ],

    proxy: {
        type: 'customrest',
        url: '',
        writer: {
            writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'records'
        }
    }
});
