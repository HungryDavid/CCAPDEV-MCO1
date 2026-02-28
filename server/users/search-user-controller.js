exports.getPage = (req, res) => {
    res.render('search-profile', {  //render body
        title: 'Search User', 
        headerTitle: 'Search User',
        layout: 'dashboard',
        activePage: 'search-user',
    });
};