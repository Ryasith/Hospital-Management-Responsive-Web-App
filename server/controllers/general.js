import User from "../models/User.js";
import ChildInfo from "../models/ChidInfo.js";
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const SaveChildInfo = async (req, res) => {
  try {
    const {
      childFirstName,
      childLastName,
      dateOfBirth,
      parentName,
      gender,
      address,
      mobile,
      height,
      weight,
      bmi,
      birthWeight,
      vaccinationStatus,
      feedingStatus,
      healthConditions,
      dietryHabits,
      socioeconomicStatus,
      sanitizationFacs,
      waterSource,
      houseSize,
      accessToHealthcare,
      dateOfDataCollection,
      collectorName,
      collectionLocation,
    } = req.body;

    const newChildInfo = new ChildInfo({
      childFirstName,
      childLastName,
      dateOfBirth,
      parentName,
      gender,
      address,
      mobile,
      height,
      weight,
      bmi,
      birthWeight,
      vaccinationStatus,
      feedingStatus,
      healthConditions,
      dietryHabits,
      socioeconomicStatus,
      sanitizationFacs,
      waterSource,
      houseSize,
      accessToHealthcare,
      dateOfDataCollection,
      collectorName,
      collectionLocation,
      childImagePath: req.file ? req.file.path : null
    });
    const savedChildInfo = await newChildInfo.save();
    res.status(201).json(savedChildInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChildren = async (req, res) => {
  try {
    const children = await ChildInfo.find().select("childFirstName parentName gender address mobile");
    res.status(200).json(children);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const generateExcel = async (req, res) => {
//   try {
//     // Fetch data from MongoDB and transform it to plain JavaScript objects
//     const children = await ChildInfo.find({}).select('-_id').lean();

//     // Create a new workbook and add a worksheet
//     const workbook = excel.utils.book_new();
//     const worksheet = excel.utils.json_to_sheet(children);

//     // Add the worksheet to the workbook
//     excel.utils.book_append_sheet(workbook, worksheet, 'Children');

//     // Write the workbook to a buffer
//     const buffer = excel.write(workbook, { type: 'buffer', bookType: 'xlsx' });

//     // Set the response headers and send the buffer
//     res.setHeader('Content-Disposition', 'attachment; filename=children.xlsx');
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.send(buffer);
//   } catch (error) {
//     res.status(500).send('Error generating Excel file');
//   }
// };

export const generateExcel = async (req, res) => {
  try {
    // Fetch data from MongoDB
    const children = await ChildInfo.find({}).lean();

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Children');

    // Define columns
    worksheet.columns = [
      { header: 'First Name', key: 'childFirstName', width: 20 },
      { header: 'Last Name', key: 'childLastName', width: 20 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Parent Name', key: 'parentName', width: 20 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Phone Number', key: 'mobile', width: 15 },
      { header: 'Height', key: 'height', width: 15 },
      { header: 'Weight', key: 'weight', width: 15 },
      { header: 'BMI', key: 'bmi', width: 15 },
      { header: 'Birth Weight', key: 'birthWeight', width: 15 },
      { header: 'Vaccination Status', key: 'vaccinationStatus', width: 17 },
      { header: 'Feeding Status', key: 'feedingStatus', width: 15 },
      { header: 'Health Conditions', key: 'healthConditions', width: 25 },
      { header: 'Dietry Habits', key: 'dietryHabits', width: 25 },
      { header: 'Socioeconomic Status', key: 'socioeconomicStatus', width: 18 },
      { header: 'Sanitization Facilities', key: 'sanitizationFacs', width: 20 },
      { header: 'Water Source', key: 'waterSource', width: 15 },
      { header: 'Household Size', key: 'houseSize', width: 15 },
      { header: 'Access To Health care', key: 'accessToHealthcare', width: 20 },
      { header: 'Date of Data Collection', key: 'dateOfDataCollection', width: 20 },
      { header: 'Collector Name', key: 'collectorName', width: 15 },
      { header: 'Collection Location', key: 'collectionLocation', width: 15 },
      { header: 'Child Image', key: 'childImagePath', width: 15 }
    ];

    // Apply header styles
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCE5FF' }
      };
    });

    // Set the height of the header row
worksheet.getRow(1).height = 20;

    // Add rows and images
    for (const child of children) {
      const row = worksheet.addRow({
        childFirstName: child.childFirstName,
        childLastName: child.childLastName,
        dateOfBirth: new Date(child.dateOfBirth).toLocaleDateString(),
        parentName: child.parentName,
        gender: child.gender,
        address: child.address,
        mobile: child.mobile,
        height: child.height,
        weight: child.weight,
        bmi: child.bmi,
        birthWeight: child.birthWeight,
        vaccinationStatus: child.vaccinationStatus,
        feedingStatus: child.feedingStatus,
        healthConditions: child.healthConditions,
        dietryHabits: child.dietryHabits,
        socioeconomicStatus: child.socioeconomicStatus,
        sanitizationFacs: child.sanitizationFacs,
        waterSource: child.waterSource,
        houseSize: child.houseSize,
        accessToHealthcare: child.accessToHealthcare,
        dateOfDataCollection: new Date(child.dateOfDataCollection).toLocaleDateString(),
        collectorName: child.collectorName,
        collectionLocation: child.collectionLocation,
        childImagePath: '' // Placeholder for the image cell
      });

      // Add image if it exists
      if (child.childImagePath) {
        const imagePath = path.resolve(child.childImagePath);
        if (fs.existsSync(imagePath)) {
          const imageId = workbook.addImage({
            filename: imagePath,
            extension: path.extname(imagePath).substring(1)
          });
          worksheet.addImage(imageId, {
            tl: { col: 23, row: row.number - 1 },
            ext: { width: 100, height: 100 }
          });
          row.height = 100;
        }
      }
    }

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers and send the buffer
    res.setHeader('Content-Disposition', 'attachment; filename=children.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Error generating Excel file');
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    // Fetch all child info data and user data
    const childInfos = await ChildInfo.find().exec();
    const users = await User.find().exec();

    // Process child info data and organize by month
    const monthlyData = childInfos.reduce((acc, childInfo) => {
      const date = new Date(childInfo.dateOfDataCollection);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      // Ensure the year-month exists in the accumulator
      const key = `${month} ${year}`;
      if (!acc[key]) {
        acc[key] = { month, year, totalChildren: 0, totalUsers: 0 };
      }

      // Increment the total children count
      acc[key].totalChildren += 1;

      return acc;
    }, {});

    // Organize user data by month
    const userMonthlyData = users.reduce((acc, user) => {
      const date = new Date(user.createdAt); // Assuming the user creation date for monthly aggregation
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();

      // Ensure the year-month exists in the accumulator
      const key = `${month} ${year}`;
      if (!acc[key]) {
        acc[key] = { month, year, totalUsers: 0 };
      }

      // Increment the total users count
      acc[key].totalUsers += 1;

      return acc;
    }, {});

    // Merge user data into child data
    Object.keys(userMonthlyData).forEach(key => {
      if (monthlyData[key]) {
        monthlyData[key].totalUsers = userMonthlyData[key].totalUsers;
      } else {
        monthlyData[key] = userMonthlyData[key];
      }
    });

    // Convert the accumulated data into an array
    const formattedData = Object.values(monthlyData);

    // Send the response
    res.status(200).json({ monthlyData: formattedData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getChildInfoBMIData = async (req, res) => {
  try {
    // Fetch all children records
    const children = await ChildInfo.find();

    // Initialize BMI categories count
    const bmiCategories = {
      '<18.5': 0,
      '18.5-24.9': 0,
      '25-29.9': 0,
      '30-34.9': 0,
      '35<': 0,
    };

    // Calculate BMI and categorize
    children.forEach((child) => {
      if (child.bmi) {
        const bmi = child.bmi;
        if (bmi < 18.5) {
          bmiCategories['<18.5'] += 1;
        } else if (bmi >= 18.5 && bmi <= 24.9) {
          bmiCategories['18.5-24.9'] += 1;
        } else if (bmi >= 25 && bmi <= 29.9) {
          bmiCategories['25-29.9'] += 1;
        } else if (bmi >= 30 && bmi <= 34.9) {
          bmiCategories['30-34.9'] += 1;
        } else if (bmi >= 35) {
          bmiCategories['35<'] += 1;
        }
      }
    });

    // Total number of children
    const totalChildren = children.length;

    // Create the response object
    const responseData = {
      childrenByBMICategory: bmiCategories,
      totalChildren,
    };

    // Send the response
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching child info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Fetch total number of users
    const totalUsers = await User.countDocuments();
    
    // Fetch all children data and count
    const children = await ChildInfo.find().select("childFirstName parentName gender address mobile");
    const totalChildren = children.length;

    res.status(200).json({
      totalUsers,
      totalChildren,
      children,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};