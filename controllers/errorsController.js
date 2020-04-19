//takes user to page with title page not found
exports.get404 = (req, res) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
  };