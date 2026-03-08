const User = require('./User');

exports.renderMyProfilePage = async (req, res) => {
    try {
        const sessionUser = await User.readUserByIdSafe(req.session.userId).lean();
        if (!sessionUser) {
            return res.redirect('/login');
        }

        res.render('partials/profile-card', {
            user: sessionUser,
            account: sessionUser,
            title: 'My Profile',
            headerTitle: 'My Profile',
            layout: 'dashboard',
            activePage: 'my-profile',
            isOwner: true
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

exports.renderSearchUserPage = (req, res) => {
    res.render('search-profile', {  //render body
        title: 'Search User', 
        headerTitle: 'Search User',
        layout: 'dashboard',
        activePage: 'search-user',
    });
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        await user.updateUser(req.body, filePath);
        res.redirect('/my-profile');
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating profile");
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        await User.deleteUser(req.session.userId);
        req.session.destroy();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.searchUser = async (req, res) => {
  try {
    const sessionUserDoc = await User.readUserByIdSafe(req.session.userId);
    const sessionUser = sessionUserDoc ? sessionUserDoc.toObject() : null;

    const query = req.query.q?.trim() || '';

    if (!query) {
      return res.render('search-profile', {
        title: 'Search Users',
        headerTitle: 'Search User',
        layout: 'dashboard',
        activePage: 'search-user',
        user: sessionUser,
        searchedUser: null,
        searchQuery: ''
      });
    }

    let searchedUser = null;
    try {
      const searchedUserDoc = await User.readUserSafeAndPublic(query);
      searchedUser = searchedUserDoc?.toObject() || null;
    } catch (err) {
      if (err.message !== 'User not found.') {
        console.error('Error fetching user:', err);
      }
      searchedUser = null; // gracefully handle not found
    }

    console.log(searchedUser);

    res.render('search-profile', {
      title: 'Search User',
      headerTitle: 'Search User',
      layout: 'dashboard',
      activePage: 'search-user',
      user: sessionUser,
      account: searchedUser ,
      searchQuery: query
    });

  } catch (error) {
    console.error('Search User Controller Error:', error);
    res.redirect('/');
  }
};
