Ext.define('App.<%= location %>.<%= name %>', {
    extend: 'Ext.Container',
    xtype: '<%= xtype %>',<% if (userCls) { %>
    userCls: 'app-<%= userCls %>',<% } %>

    requires: [<% if (controller) { %>
        'App.<%= location %>.<%= name %>Controller',<% } %><% if (viewModel) { %>
        'App.<%= location %>.<%= name %>ViewModel'<% } %>
    ],
    <% if (controller) { %>
    controller: '<%= xtype %>Controller',<% } %><% if (viewModel) {%>
    viewModel: '<%= xtype %>ViewModel',<% } %>

    items: [
        // Add items
    ]
});
