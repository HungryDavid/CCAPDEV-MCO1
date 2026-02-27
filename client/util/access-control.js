//Show front page content based on user type
const userType = sessionStorage.getItem("userType");

  document.querySelectorAll("[data-role]").forEach(el => {
    const allowedRoles = el.dataset.role.split(",");

    if (!allowedRoles.includes(userType)) {
      el.remove();;
    }
  });

