exports.getPage = (req, res) => {
    res.render('register', {  //render body
        title: 'Slots Availabilty', 
        headerTitle: 'Slots Availabilty',
        layout: 'dashboard',
        activePage: 'slots-availability',
    });
};