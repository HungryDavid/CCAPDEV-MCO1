exports.getPage = (req, res) => {
    res.render('my-reservations', {  //render body
        title: 'My Reservations', 
        headerTitle: 'My Reservations',
        layout: 'dashboard',
        activePage: 'my-reservations',
    });
};