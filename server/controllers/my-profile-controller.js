const User = require('../models/User');

exports.redirectToMyProfile = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId).lean();
    if (!user) {
        return res.redirect('/login');
    }

    const userIdNumber = user.idNumber;
    res.redirect(`/my-profile/${userIdNumber}`);
};

exports.getPage = async (req, res) => {
    try {
        const sessionUserId = req.session.userId;
        const sessionUser = await User.findUserById(sessionUserId).lean();
        if (!sessionUser) {
            return res.redirect('/login');
        }

        const sessionUserIdNumber = sessionUser.idNumber;
        const paramIdNumber = req.params.idNumber;


        res.render('partials/profile-card', {
            user: sessionUser,
            account: sessionUser,
            title: 'My Profile',
            headerTitle: 'My Profile',
            layout: 'dashboard',
            activePage: 'my-profile',
            isOwner: req.session.userId &&
                sessionUserIdNumber === paramIdNumber
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        await user.updateProfile(req.body, filePath);
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
    const sessionUserDoc = await User.findUserById(req.session.userId);
    const sessionUser = sessionUserDoc ? sessionUserDoc.toObject() : null;

    const query = req.query.q?.trim();

    if (!query) {
      return res.render('search-profile', {
        title: 'Search Users',
        headerTitle: 'Search User',
        layout: 'dashboard',
        activePage: 'search-user',
        user: sessionUser,
        account: null,
        searchQuery: ''
      });
    }

    let account = null;
    try {
      const userDoc = await User.findPublicProfile(query);
      console.log(userDoc);
      account = userDoc ? userDoc.toObject() : null;
      console.log(account);
    } catch (err) {
      if (err.message === 'User not found.') {
        account = null; // user not found → handled gracefully
      } else {
        console.error(err);
      }
    }

    res.render('search-profile', {
      title: 'Search User',
      headerTitle: 'Search User',
      layout: 'dashboard',
      activePage: 'search-user',
      user: sessionUser,
      account,
      searchQuery: query
    });
 console.log("rendered");
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};

//const profile = await User.findPublicProfile(req.params.identifier);