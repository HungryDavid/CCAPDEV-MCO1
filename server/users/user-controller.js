const User = require('./User');
const Reservation = require('../reservations/Reservation');
const {renderErrorPage } = require('../util/helpers');


//updates a user's profile information such as their bio and profile picture
exports.updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.session.userId);
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    await user.updateUser(bio, filePath);
    res.redirect('/user/me');
  } catch (err) {
    renderErrorPage(res, err);
  }
};

//deletes a user from the database and also deletes all reservations associated with that user
exports.deleteProfile = async (req, res) => {
  try {
    await User.deleteUser(req.session.userId);
    req.session.destroy();
    res.redirect('/auth/login');
  } catch (err) {
    renderErrorPage(res, err);
  }
};

//fetches a user by their unique ID and excludes sensitive information like password and role
exports.searchUser = async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';
    let searchedUser = null;
    let searchedUserReservation;
    let message = null;
    if (query) {
      try {
        searchedUser = await User.searchUser(query);

        if (!searchedUser){
          throw new Error ("No User Found");
        }

        searchedUserReservation = await Reservation.getUserPublicReservation(searchedUser._id);
        
      } catch (err) {
        message = 'No user found matching the search criteria.';
        searchedUser = null;
      }
    }

    res.render('search-profile', {
      title: 'Search Users',
      headerTitle: 'Search User',
      layout: 'dashboard',
      activePage: 'search-user',
      account: searchedUser,
      reservations: searchedUserReservation,
      isOwner: false,
      searchQuery: query,
    })
  } catch (err) {
    renderErrorPage(res, err);
  }
};

//fetches the profile of the currently logged-in user and their reservations, then renders the profile page
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.session.userId);
    const reservations = await Reservation.getAllUserReservation(req.session.userId);

    console.log('User:', user);
    res.render('partials/profile-card', {
      title: 'My Profile',
      headerTitle: 'My Profile',
      layout: 'dashboard',
      activePage: 'my-profile',
      account: user,
      isOwner: true,
      reservations
    });

  } catch (err) {
    renderErrorPage(res, err);
  }
};