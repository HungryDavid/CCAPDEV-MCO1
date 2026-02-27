const Laboratory = require('../models/Lab');

exports.getPage = async (req, res) => {
    try {
        // Fetch all labs from the database
        const labs = await Laboratory.getAllLabs(req.query);
        console.log(labs);  // Log the labs data to check what you're receiving

        // Render the page with labs data
        res.render('manage-labs', {
            title: 'Manage Labs',
            headerTitle: 'Manage Labs',
            layout: 'dashboard',
            activePage: 'manage-labs',
            labs
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};


// 1. CREATE: Create a new lab
exports.createLab = async (req, res) => {
    try {
        const { name, capacity, openTime, closeTime, image } = req.body;

        // Create the lab
        const labData = {
            name,
            capacity,
            openTime,
            closeTime,
            image: image || 'lab-default.jpg' // Use default image if not provided
        };

        const newLab = await Laboratory.createLab(labData);
        res.redirect('/manage-labs'); // Redirect to the list of labs after creating
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating lab');
    }
};


// 3. READ ONE: Get a specific lab by ID for editing
exports.getLabById = async (req, res) => {
    try {
        const { id } = req.params;
        const lab = await Laboratory.getLabById(id);
        if (!lab) {
            return res.status(404).send('Lab not found');
        }
        res.render('labs/edit-lab', { lab }); // Pass lab to edit form view
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching lab for editing');
    }
};

// 4. UPDATE: Update a lab's details
exports.updateLab = async (req, res) => {
    try {
        const labId = req.params.id;  // Get the lab ID from the URL
        const { name, openTime, closeTime, capacity } = req.body;  // Extract data from the form submission

        // Call the updateLab method from the model
        const updatedLab = await Laboratory.updateLab(labId, {
            name,
            openTime,
            closeTime,
            capacity
        });

        // Redirect back to the labs page with updated lab list
        res.redirect('/manage-labs');  // Adjust if needed to the correct route

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the lab.");
    }
};

// 5. DELETE: Delete a lab by ID
exports.deleteLab = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLab = await Laboratory.deleteLab(id);

        if (!deletedLab) {
            return res.status(404).send('Lab not found');
        }

        res.redirect('/labs'); // Redirect to labs list after successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting lab');
    }
};