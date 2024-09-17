var express = require('express');
const BannerCollection = require('../models/banner');
const imagekit = require('../utils/imagekit');
const CategoryCollection = require('../models/category');
const SubcategoryCollection = require("../models/subcategory");
const childCategoryCollection = require('../models/childCategory');
const AdsectionCollection = require('../models/adsectin');
const AdminCollection = require('../models/admin');
const NotificationCollection = require('../models/Notification');
const partnerCollection = require('../models/partner');
const creditCollection = require('../models/credit_package');
const CityCollection = require('../models/City');
const promocodesCollection = require('../models/promocode');
const customNotificationCollection = require('../models/customNotification');
const DisputeCollection = require('../models/dispute');
const TestinomialsCollection = require('../models/testinomials');
const { isAuthenticated } = require('../utils/isAuthenticated');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/profile", (req, res, next) => {
  res.send("Profile");
})

// -------------------------- Signout --------------------------------------------------------------------------

router.get("/signout", isAuthenticated, (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); } // Handle potential errors during logout
    res.status(200).json({ success: true, message: "You have been logged out successfully" });
  });
});

// ----------------------------------- Banner ------------------------------------------------------------------------

router.get("/getBanner", async (req, res, next) => {
  try {
    const data = await BannerCollection.find();

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No banners found" });
    }

    res.status(200).json({ success: true, data });
  }
  catch (err) {
    next(err);
  }
});


router.post("/addBanner", isAuthenticated, async (req, res, next) => {
  try {
    const banner = await new BannerCollection(req.body);
    await banner.save();
    console.log(banner);
    res.status(200).json({
      data, success: true
    });
  }
  catch (err) {
    next(err);
  }
})

router.post("/BannerImage/:id", isAuthenticated, async (req, res, next) => {
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

    return res.status(404).send({
      message: 'Banner not found', success: true
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send('An error occurred');
  }
});

router.post("/BannerUpdate/:id", isAuthenticated, async (req, res, next) => {
  try {
    const data = await BannerCollection.findByIdAndUpdate(req.params.id, req.body)
    await data.save();
    if (!data) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.status(200).json({
      success: true,
      message: 'Banner Updated Successfully!'
    })
  }
  catch (err) {
    next(err);
  }
})

router.get("/DeleteBanner/:id", isAuthenticated, async (req, res, next) => {
  try {
    const Banner = await BannerCollection.findById(req.params.id);
    await imagekit.deleteFile(Banner.image.fileId);
    await BannerCollection.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Banner Deleted Successfully'
    })

  }
  catch (err) {
    next(err);
  }
})

// --------------------------------- Category ------------------------------------------------------------------------

router.get("/getCategory", async (req, res, next) => {
  try {
    const category = await CategoryCollection.find();
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: "No Category found" });
    }
    res.status(200).json({ category, message: 'Category Updated Successfully!', success: true });
  }
  catch (err) {
    next(err);
  }
})

router.post("/addCategory", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body || req.body.name.trim() === "") {
      return res.status(400).json({ success: false, message: "Please Check your data first" });
    }

    const category = await new CategoryCollection(req.body);
    await category.save();
    res.status(200).json({
      success: true,
      message: "Category Added Successfully"
    });
  }
  catch (err) {
    next(err);
  }
})

router.post("/categoryImage/:id", isAuthenticated, async (req, res, next) => {
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

    // res.redirect("/users/profile"); // Adjust as necessary
    res.status(200).json({ success: true, message: "Image Added !" });
  } catch (err) {
    // console.log(err.message);
    // res.status(500).json({ err, success: false }); // Respond with an error status
    next(err);
  }
});

router.post("/CategoryUpdate/:id", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body)
      return res.status(400).json({
        success: false,
        message: 'No Data!'
      })
    const data = await CategoryCollection.findByIdAndUpdate(req.params.id, req.body)
    await data.save();
    res.status(200).json({
      data,
      success: true,
      message: 'Category Updated Successfully!'
    })
  }
  catch (err) {
    next(err);
  }
})

router.get("/DeleteCategory/:id", isAuthenticated, async (req, res, next) => {
  try {
    const Category = await CategoryCollection.findById(req.params.id);
    if (!Category) {
      return res.status(400).json({
        success: false,
        message: 'Category Not Found!'
      })
    }
    await imagekit.deleteFile(Category.image.fileId);
    await CategoryCollection.findByIdAndDelete(req.params.id);
    res.status(200).json(
      {
        success: true,
        message: "Category Deleted Successfully!"
      })

  }
  catch (err) {
    next(err);
  }
})

// ----------------------------- Add Subcategory -------------------------------------------

router.get("/getSubcategory", async (req, res, next) => {
  try {
    const category = await SubcategoryCollection.find();
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: "No SubCategory found" });
    }
    res.status(200).json({ category, message: 'SubCategory Updated Successfully!', success: true });
  }
  catch (err) {
    // console.log(err.message);
    next(err);
  }
})

router.post('/addSubcategory', isAuthenticated, async (req, res, next) => {
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


router.post("/UpdateSubCategory/:id", isAuthenticated, async (req, res, next) => {
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

    res.send({
      updatedSubcategory, success: true,
      message: "Subcategory Updated Successfully!"
    });
  } catch (err) {
    next(err);
    // console.log(err.message);
    // res.status(500).send("Server Error");
  }
});


router.get("/DeleteSubcategory/:id", isAuthenticated, async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      message: "SubCategory Deleted Successfully!"
    });
  } catch (err) {
    // console.error("Error:", err.message);
    // res.status(500).send("Server Error");
    next(err);
  }
});

// --------------------------------------- Child Category ------------------------------------

router.get("/getChildCategory", async (req, res) => {
  try {
    const data = await CategoryCollection.find();
    if (data.length == 0) {
      res.status(400).json({
        success: false,
        message: 'Data Not Present'
      })
    }
    res.status(200).json({ data, success: true });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

router.post("/addOrUpdateChildCategory", isAuthenticated, async (req, res) => {
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

    res.status(201).json({
      savedChildCategory, success: true
    });
  } catch (err) {
    // console.error(err.message);
    // res.status(500).send("Server Error");
    next(err);
  }
});

router.post("/ChildCategoryImage/:id", isAuthenticated, async (req, res, next) => {
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

    // res.redirect("/users/profile"); // Adjust as necessary
    res.status(200).json({
      success: true,
      message: "Image added !"
    })
  } catch (err) {
    // console.log(err.message);
    // res.status(500).send('An error occurred'); // Respond with an error status
    next(err);
  }
});


router.get("/DeleteChildCategory/:id", isAuthenticated, async (req, res, next) => {
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

    // res.redirect("/users/profile");
    res.status(200).json({
      success: true,
      message: 'Child Category Deleted!'
    })
  } catch (err) {
    next(err);
    // console.error(err.message);
    // res.status(500).send('An error occurred');
  }
});

// --------------------------- Adsection ----------------------------------

const ADMIN_ID = '66ae731eab5de1feb6412783';

router.get("/getAdsection", async (req, res) => {
  try {
    const data = await AdsectionCollection.find();
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "data not present"
      })
    }
    res.status(200).json({
      success: true,
      data,
    });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

router.post("/Adsection", isAuthenticated, async (req, res, next) => {
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
      success: true,
      message: 'Adsection added to admin successfully',
      adsection
    });
  } catch (err) {
    // console.log(err.message);
    // res.status(500).json({ message: 'Server error' });
    next(err);
  }
});

router.post("/UpdateAdSection/:id", isAuthenticated, async (req, res, next) => {
  try {
    const data = await AdsectionCollection.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "User not present"
      })
    }
    await data.save();
    res.status(200).send({ data, success: true, message: "Updated Successfully" });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

router.post("/AdSectionImage/:id", isAuthenticated, async (req, res, next) => {
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

    // res.redirect("/users/profile"); // Adjust as necessary
    res.status(200).json({
      success: true,
      message: "Image Added Successfully!"
    })
  } catch (err) {

    next(err);
    // console.log(err.message);
    // res.status(500).send('An error occurred'); // Respond with an error status
  }
});

router.get("/DeleteAdSection/:id", isAuthenticated, async (req, res, next) => {
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

    // res.redirect("/users/profile");
    res.status(200).json({
      success: true,
      message: "Deleted Successfully!"
    })
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})


//----------------------------- Notification ---------------------------------------

router.get("/getNotification", async (req, res) => {
  try {
    const data = await NotificationCollection.find();
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/AddNotification", isAuthenticated, async (req, res, next) => {
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

router.post("/UpdateNotification/:id", isAuthenticated, async (req, res, next) => {
  try {
    const data = await NotificationCollection.findByIdAndUpdate(req.params.id, req.body);
    await data.save();
    res.status(200).send("Updated Successfully");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/NotificationImage/:id", isAuthenticated, async (req, res, next) => {
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

router.get("/DeleteNotification/:id", isAuthenticated, async (req, res, next) => {
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


//------------------------------- List Partner ------------------------------------------

router.get("/listPartner", async (req, res, next) => {
  try {
    const data = await partnerCollection.find();
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/addPartner", isAuthenticated, async (req, res, next) => {
  try {
    const { image, email, contact, balance, credit, status, actions } = req.body;
    const data = await new partnerCollection(req.body);
    await data.save();
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/updatePartner/:id", isAuthenticated, async (req, res, next) => {
  try {
    const data = await partnerCollection.findByIdAndUpdate(req.params.id, req.body);
    await data.save();
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/AddAvatarImage/:id", isAuthenticated, async (req, res, next) => {
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
    const adsec = await partnerCollection.findById(req.params.id);

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
})

router.get("/deletePartner/:id", isAuthenticated, async (req, res, next) => {
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



// -------------------------------------- Credit Package ---------------------------------

router.get("/getcreditPackage", async (req, res, next) => {
  try {
    const data = await creditCollection.find();
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/AddcreditPackage", isAuthenticated, async (req, res, next) => {
  try {
    const data = await new creditCollection(req.body);
    await data.save();
  }
  catch (err) {
    console.log(err.message);
  }
})

router.post("/AddcreditUpdate/:id", isAuthenticated, async (req, res, next) => {
  try {
    const data = await new creditCollection.findByIdAndUpdate(req.params.id, req.body);
    await data.save();
    res.status(200).send("Details has been updated!");
  }
  catch (err) {
    console.log(err.message);
  }
})

router.get("/deletecreditpackage/:id", isAuthenticated, async (req, res, next) => {
  try {

  }
  catch (err) {
    console.log(err.message);
  }
})

// ----------------------------------- Add City ------------------------------------------------

router.post("/AddCity", isAuthenticated, async (req, res, next) => {
  try {
    const data = await CityCollection(req.body);
    await data.save();
    res.status(200).json(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

router.get("/getCity", async (req, res, next) => {
  try {
    const data = await CityCollection.find();
    console.log(data);
    res.send(data);
  }
  catch (err) {
    console.log(err.message);
  }
})

// --------------------------  Promocode ---------------------------------------
// code, percentage, maximum amount, description, expiry date, status


router.post("/AddPromocode", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Not data in req.body"
      })
    }
    const data = await new promocodesCollection(req.body);
    await data.save();
    res.status(200).json({ data, message: "Data Added Successfully", success: true });
  } catch (err) {
    next(err);
    // console.log(err.message);
    // res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.get("/GetPromocodes", async (req, res, next) => {
  try {
    const data = await promocodesCollection.find();
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Data not present"
      })
    }
    res.status(200).json({
      data, success: true
    });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

// ----------------------------------- Custom Notification -------------------------------------------------

// Add - SErivce type, scheduled, description 
// status - booked or cancel or peding

router.post('/addCustomNotification', isAuthenticated, async (req, res, next) => {
  try {
    const data = await customNotificationCollection(req.body);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Data not present"
      })
    }
    await data.save();
    res.status(200).json({ data, success: true, message: "Custom Notification Added Successfully!" });
  }
  catch (err) {
    // console.log(err.message);
    next(err);
  }
})

router.get("/getCustomNotification", async (req, res, next) => {
  try {
    const data = await customNotificationCollection.find();
    if (data.length == 0) {
      return res.status(400).json({
        success: false, message: "Data not present"
      })
    }
    res.status(200).json({ data, success: true });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

// --------------------------------- Dispute --------------------------------------------

router.post("/addDispute", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Request body cannot be empty" });
    }

    const data = new DisputeCollection(req.body);
    await data.save();
    res.status(200).json({ data, success: true });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})


router.get("/getDispute", async (req, res, next) => {
  try {
    const data = await DisputeCollection.find();

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No disputes found" });
    }

    res.status(200).json({ success: true, data });
  }
  catch (err) {
    console.log(err.message);
  }
})


// ---------------------------- Testinomials ---------------------------------
// name, comments, status, actions - update or delete

router.post("/addTestinomials", isAuthenticated, async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Request body cannot be empty" });
    }
    const data = new TestinomialsCollection(req.body);
    await data.save();
    res.status(200).json({ data, success: true });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})

router.get("/getTestinomials", async (req, res, next) => {
  try {
    const data = await TestinomialsCollection.find();
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No Testinomials found" });
    }
    res.status(200).json({ success: true, data });
  }
  catch (err) {
    next(err);
    // console.log(err.message);
  }
})





// ------------------------------------------ Customer List ------------------------------------------------
//This would be done by Sudhanshu

// ---------------------------------------------- List Payout --------------------------------------------------
//This would be done by Sudhanshu


// ------------------------------------------------- Update Profile ----------------------------------------------

router.post("/UpdateAdmin/:id", async (req, res, next) => {
  try {
    const data = await AdminCollection.findByIdAndUpdate(req.body, req.id);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Couldn't find the user"
      })
    }
    await data.save();
    res.status(200).json({
      success: true,
      message: "User Updated Successfully!"
    })
  }
  catch (err) {
    next(err);
  }
})



// ------------------------------------------------- Order -------------------------------------------------



module.exports = router;

