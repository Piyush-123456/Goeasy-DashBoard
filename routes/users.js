var express = require('express');
const BannerCollection = require('../models/banner');
const imagekit = require('../utils/imagekit');
const CategoryCollection = require('../models/category');
const SubcategoryCollection = require("../models/subcategory");
const childCategoryCollection = require('../models/childCategory');
const AdsectionCollection = require('../models/adsectin');
const AdminCollection = require('../models/admin');
const NotificationCollection = require('../models/Notification');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/profile", (req, res, next) => {
  res.send("Profile");
})

// ----------------------------------- Banner ------------------------------------------------------------------------
router.post("/addBanner", async (req, res, next) => {
  try {
    const banner = await new BannerCollection(req.body);
    await banner.save();
    res.redirect("/users/profile");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/BannerImage/:id", async (req, res, next) => {
  try {
    // Ensure `req.files` contains the uploaded file
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }
    // console.log(req.files)
    // Upload the image to ImageKit
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.image.data,
      fileName: req.files.image.name
    });

    // Find the banner by ID
    const banner = await BannerCollection.findById(req.params.id);

    if (!banner) {
      return res.status(404).send('Banner not found');
    }

    // If banner has an existing image, delete it
    if (banner.image && banner.image.fileId) {
      await imagekit.deleteFile(banner.image.fileId);
    }

    // Update banner with new image data
    banner.image = { fileId, url, thumbnailUrl };
    await banner.save();

    res.redirect("/users/profile"); // Adjust as necessary
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred'); // Respond with an error status
  }
});


router.post("/BannerUpdate/:id", async (req, res, next) => {
  try {
    const data = await BannerCollection.findByIdAndUpdate(req.params.id, req.body)
    await data.save();
    res.redirect("/users/profile")
  }
  catch (err) {
    console.log(err.message);
  }
})

router.get("/DeleteBanner/:id", async (req, res, next) => {
  try {
    const Banner = await BannerCollection.findById(req.params.id);
    await imagekit.deleteFile(Banner.image.fileId);
    await BannerCollection.findByIdAndDelete(req.params.id);
    res.redirect("/users/profile")

  }
  catch (err) {
    console.log(err.message);
  }
})

// --------------------------------- Category ------------------------------------------------------------------------

router.post("/addCategory", async (req, res, next) => {
  try {
    const category = await new CategoryCollection(req.body);
    await category.save();
    res.redirect("/users/profile");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/categoryImage/:id", async (req, res, next) => {
  try {
    // Ensure `req.files` contains the uploaded file
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }

    // Upload the image to ImageKit
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.image.data,
      fileName: req.files.image.name
    });

    // Find the banner by ID
    const category = await CategoryCollection.findById(req.params.id);

    if (!category) {
      return res.status(404).send('category not found');
    }

    // If category has an existing image, delete it
    if (category.image && category.image.fileId) {
      await imagekit.deleteFile(category.image.fileId);
    }

    // Update category with new image data
    category.image = { fileId, url, thumbnailUrl };
    await category.save();

    res.redirect("/users/profile"); // Adjust as necessary
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred'); // Respond with an error status
  }
});


router.post("/CategoryUpdate/:id", async (req, res, next) => {
  try {
    const data = await CategoryCollection.findByIdAndUpdate(req.params.id, req.body)
    await data.save();
    res.redirect("/users/profile")
  }
  catch (err) {
    console.log(err.message);
  }
})

router.get("/DeleteCategory/:id", async (req, res, next) => {
  try {
    const Category = await CategoryCollection.findById(req.params.id);
    await imagekit.deleteFile(Category.image.fileId);
    await CategoryCollection.findByIdAndDelete(req.params.id);
    res.redirect("/users/profile")

  }
  catch (err) {
    console.log(err.message);
  }
})

// ----------------------------- Add Subcategory -------------------------------------------

router.post('/addSubcategory', async (req, res, next) => {
  try {
    const { categoryName, subtitle, subcategoryName, image, status } = req.body;

    if (!categoryName || !subcategoryName) {
      return res.status(400).send('Category name and subcategory name are required');
    }

    let category = await CategoryCollection.findOne({ category: categoryName });

    if (category) {
      const newSubcategory = new SubcategoryCollection({
        category: category._id,
        subcategory: subcategoryName,
        image: image,
        status: status || 'Unpublish'
      });

      await newSubcategory.save();

      category.subcategories.push(newSubcategory._id);
      await category.save();

      res.status(201).send('Subcategory added successfully to the existing category');
    } else {
      category = new CategoryCollection({
        category: categoryName,
        subtitle: subtitle,
        image: image,
        status: status || 'Unpublish'
      });

      await category.save();

      const newSubcategory = new SubcategoryCollection({
        category: category._id,
        subcategory: subcategoryName,
        image: image,
        status: status || 'Unpublish'
      });

      await newSubcategory.save();

      category.subcategories.push(newSubcategory._id);
      await category.save();

      res.status(201).send('Category and subcategory created successfully');
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred');
  }
});


router.post("/UpdateSubCategory/:id", async (req, res, next) => {
  try {
    // Extract data from request body
    const { categoryName, subcategoryName, status } = req.body;

    // Perform the update
    const updatedSubcategory = await SubcategoryCollection.findByIdAndUpdate(
      req.params.id,
      {
        subcategory: subcategoryName,
        status: status
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).send("Subcategory not found.");
    }

    res.send("Subcategory Updated Successfully!");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


router.get("/DeleteSubcategory/:id", async (req, res, next) => {
  try {
    const data = await SubcategoryCollection.findById(req.params.id);

    if (!data) {
      return res.status(404).send("Subcategory not found.");
    }

    if (data.image && data.image.fileId) {
      try {
        await imagekit.deleteFile(data.image.fileId);
      } catch (imgErr) {
        console.error("Error deleting file from ImageKit:", imgErr.message);
        return res.status(500).send("Error deleting file from ImageKit.");
      }
    }

    // Delete the subcategory
    await SubcategoryCollection.findByIdAndDelete(req.params.id);

    res.send("Deleted Successfully!");
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Server Error");
  }
});

// --------------------------------------- Child Category ------------------------------------

router.post("/addOrUpdateChildCategory", async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryName,
      childcategory,
      price,
      discount,
      platformCharge,
      servicetime,
      maxquantity,
      image,
      status,
      serviceQuantity,
      serviceDescription,
      city
    } = req.body;

    // Verify that the provided category ID exists
    const category = await CategoryCollection.findById(categoryId);
    if (!category) {
      return res.status(400).send("Invalid Category ID");
    }

    // Find or create the SubCategory
    let subcategory = await SubcategoryCollection.findOne({ subcategory: subcategoryName, category: categoryId });

    if (!subcategory) {
      // Create a new SubCategory if none exists
      subcategory = new SubcategoryCollection({
        category: categoryId, // Include category ID
        subcategory: subcategoryName,
        childCategories: [] // Initialize with an empty array
      });

      // Save the new SubCategory
      const savedSubcategory = await subcategory.save();
      subcategory = savedSubcategory;
    }

    // Create or update the ChildCategory
    const newChildCategory = new childCategoryCollection({
      category: categoryId, // Reference to the Category document
      subcategory: subcategory._id,
      childcategory,
      price,
      discount,
      platformCharge,
      servicetime,
      maxquantity,
      image,
      status,
      serviceQuantity,
      serviceDescription,
      city
    });

    // Save the new ChildCategory
    const savedChildCategory = await newChildCategory.save();

    // Update the SubCategory to include the new ChildCategory
    await SubcategoryCollection.findByIdAndUpdate(
      subcategory._id,
      { $push: { childCategories: savedChildCategory._id } }
    );

    res.status(201).send("ChildCategory added or updated successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/ChildCategoryImage/:id", async (req, res, next) => {
  try {
    // Ensure `req.files` contains the uploaded file
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }
    console.log(req.files)
    // Upload the image to ImageKit
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.image.data,
      fileName: req.files.image.name
    });

    // Find the banner by ID
    const child = await childCategoryCollection.findById(req.params.id);

    if (!child) {
      return res.status(404).send('Child not found');
    }

    // If banner has an existing image, delete it
    if (child.image && child.image.fileId) {
      child.image = { fileId, url, thumbnailUrl };
      await imagekit.deleteFile(child.image.fileId);
    }

    // Update banner with new image data
    await child.save();

    res.redirect("/users/profile"); // Adjust as necessary
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred'); // Respond with an error status
  }
});


router.get("/DeleteChildCategory/:id", async (req, res, next) => {
  try {
    const child = await childCategoryCollection.findById(req.params.id);
    console.log(child);
    if (!child) {
      return res.status(404).send('Child Category not found');
    }

    console.log('File ID:', child.image.fileId);

    if (!child.image || !child.image.fileId) {
      return res.status(400).send('No fileId found in child image data');
    }

    await imagekit.deleteFile(child.image.fileId);

    await childCategoryCollection.findByIdAndDelete(req.params.id);

    res.redirect("/users/profile");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('An error occurred');
  }
});

// --------------------------- Adsection ----------------------------------

const ADMIN_ID = '66ae731eab5de1feb6412783';

router.post("/Adsection", async (req, res, next) => {
  try {
    // Extract data from the request body
    const { category, title, price, image, status } = req.body;

    // Create and save the Adsection
    const adsection = new AdsectionCollection({
      category,
      title,
      price,
      image,
      status
    });
    await adsection.save();

    // Find the admin by ID and add the Adsection
    const admin = await AdminCollection.findById(ADMIN_ID);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Add the new Adsection to the admin's adsections list
    admin.adsections.push(adsection._id);
    await admin.save();

    // Send a success response
    res.status(201).json({
      message: 'Adsection added to admin successfully',
      adsection
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/UpdateAdSection/:id", async (req, res, next) => {
  try {
    const data = await AdsectionCollection.findByIdAndUpdate(req.params.id, req.body);
    await data.save();
    res.status(200).send("Updated Successfully");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/AdSectionImage/:id", async (req, res, next) => {
  try {
    // Ensure `req.files` contains the uploaded file
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }
    // console.log(req.files)
    // Upload the image to ImageKit
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.image.data,
      fileName: req.files.image.name
    });

    // Find the banner by ID
    const adsec = await AdsectionCollection.findById(req.params.id);

    if (!adsec) {
      return res.status(404).send('Adection not found');
    }

    // If banner has an existing image, delete it
    if (adsec.image && adsec.image.fileId) {
      await imagekit.deleteFile(adsec.image.fileId);
    }

    adsec.image = { fileId, url, thumbnailUrl };
    // Update banner with new image data
    await adsec.save();

    res.redirect("/users/profile"); // Adjust as necessary
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred'); // Respond with an error status
  }
});

router.get("/DeleteAdSection/:id", async (req, res, next) => {
  try {
    const data = await AdsectionCollection.findById(req.params.id);
    if (!data) {
      return res.status(404).send('Adsection not found');
    }


    if (!data.image || !data.image.fileId) {
      return res.status(400).send('No fileId found in image data');
    }

    await imagekit.deleteFile(data.image.fileId);

    await AdsectionCollection.findByIdAndDelete(req.params.id);

    res.redirect("/users/profile");
  }
  catch (err) {
    console.log(err.message);
  }
})


//----------------------------- Notification ---------------------------------------


router.post("/AddNotification", async (req, res, next) => {
  try {
    const data = await new NotificationCollection(req.body);
    const admin = await AdminCollection.findById(ADMIN_ID);
    admin.notifications.push(data._id);
    console.log(data)
    await admin.save();
    await data.save();

    res.status(201).send("Notification is added!");
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send("Error adding notification");
  }
});

router.post("/UpdateNotification/:id", async (req, res, next) => {
  try {
    const data = await NotificationCollection.findByIdAndUpdate(req.params.id, req.body);
    await data.save();
    res.status(200).send("Updated Successfully");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/NotificationImage/:id", async (req, res, next) => {
  try {
    // Ensure `req.files` contains the uploaded file
    if (!req.files || !req.files.image) {
      return res.status(400).send('No image file uploaded');
    }
    // console.log(req.files)
    // Upload the image to ImageKit
    const { fileId, url, thumbnailUrl } = await imagekit.upload({
      file: req.files.image.data,
      fileName: req.files.image.name
    });

    // Find the banner by ID
    const adsec = await NotificationCollection.findById(req.params.id);

    if (!adsec) {
      return res.status(404).send('Notification not found');
    }

    // If banner has an existing image, delete it
    if (adsec.image && adsec.image.fileId) {
      await imagekit.deleteFile(adsec.image.fileId);
    }

    adsec.image = { fileId, url, thumbnailUrl };
    // Update banner with new image data
    await adsec.save();

    res.redirect("/users/profile"); // Adjust as necessary
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred'); // Respond with an error status
  }
});

router.get("/DeleteNotification/:id", async (req, res, next) => {
  try {
    const data = await NotificationCollection.findById(req.params.id);
    if (!data) {
      return res.status(404).send('Adsection not found');
    }


    if (!data.image || !data.image.fileId) {
      return res.status(400).send('No fileId found in image data');
    }

    await imagekit.deleteFile(data.image.fileId);

    await NotificationCollection.findByIdAndDelete(req.params.id);

    res.redirect("/users/profile");
  }
  catch (err) {
    console.log(err.message);
  }
})

module.exports = router;
