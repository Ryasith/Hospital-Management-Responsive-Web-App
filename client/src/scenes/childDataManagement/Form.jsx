import React, { useRef, useEffect, useState, useMemo } from "react";
import StickTopStepper from 'components/StickTopStepper'
import {
    Box,
    Divider,
    FormControl,
    Grid,
    Stack,
    Typography,
    Radio,
    TextField,
    IconButton
} from "@mui/material";
import Header from 'components/Header';
import Card from 'components/Card';
import { Controller, useForm } from "react-hook-form";
import BorderedSection from "components/BorderedSection";
import CustomTextField from "components/CustomTextField";
import CustomDatePicker from "components/CustomDatePicker";
import CustomRadioButton from "components/CustomRadioButton";
import Button from "components/Button";
import { CancelOutlined, SaveOutlined, DeleteForeverOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomPatternTextField from 'components/CustomPatternTextField';
import Swal from 'sweetalert2'
import Dropzone from "components/Dropzone";

const DB_NAME = 'childDataDB';
const DB_VERSION = 1;
const DB_STORE_NAME = 'childDataStore';

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                const objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('file', 'file', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};


const formatDateString = (date) => {
    const d = new Date(date.$d || date); // Handle Day.js or Date object
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Form = () => {

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
        watch,
        trigger,
        clearErrors,
        setError
    } = useForm();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [environmentalInfoValid, setPatientInfoValid] = useState(false);
    const [healthInfoValid, setProductInfoValid] = useState(false);
    const [additionalInfoValid, setInsuranceInfoValid] = useState(false);
    const [personalInfoValid, setPersonalInfoValid] = useState(false);

    const personalInformationRequestRef = useRef(null);
    const healthInformationRequestRef = useRef(null);
    const environmentalInformationRequestRef = useRef(null);
    const additionalInformationRequestRef = useRef(null)

    const [firstLoad, setFirstLoad] = useState(true);

    const [files, setFiles] = useState([]);

    const steps = [
        { stepName: "Personal Information", isCompleted: personalInfoValid },
        { stepName: "Health Information", isCompleted: healthInfoValid },
        { stepName: "Environmental Information", isCompleted: environmentalInfoValid },
        { stepName: "Additional Information", isCompleted: additionalInfoValid }
    ];

    const patientGenderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ];

    useEffect(() => {
        if (!firstLoad) {
            const scrollToElement = (elementRef) => {
                if (elementRef && elementRef.current) {
                    elementRef.current.scrollIntoView({ behavior: "smooth" });
                }
            };
            switch (activeStep) {
                case 0:
                    scrollToElement(personalInformationRequestRef);
                    break;
                case 1:
                    scrollToElement(healthInformationRequestRef);
                    break;
                case 2:
                    scrollToElement(environmentalInformationRequestRef);
                    break;
                case 3:
                    scrollToElement(additionalInformationRequestRef);
                    break;
                default:
                    break;
            }
        } else {
            setFirstLoad(false);
        }
    }, [activeStep]);

    const addChildData = async (formData) => {
        const savedChildResponse = await fetch("http://localhost:5001/general/add_child_Info", {
            method: "POST",
            body: formData,
        });
        const savedChild = await savedChildResponse.json();
        if (savedChild) {
            Swal.fire({
                title: "Child Data Recorded Successfully",
                icon: "success"
            }).then(() => {
                navigate(-1)
            })
        }
    };

    const saveToIndexedDB = (data, file) => {
        return openDatabase().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
                const store = transaction.objectStore(DB_STORE_NAME);
                store.add({ ...data, file });
    
                transaction.oncomplete = () => {
                    Swal.fire({
                        title: "You are on Offline Mode",
                        text: "Recorded child data and will be uploaded to the server when online",
                        icon: "warning"
                    }).then(() => {
                        navigate(-1);
                    });
                    resolve();
                };
    
                transaction.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        });
    };
    

    const onSubmit = async (data) => {
            // Convert Day.js objects to "YYYY-MM-DD" format
    const convertedData = {
        ...data,
        dateOfBirth: formatDateString(data.dateOfBirth),
        dateOfDataCollection: formatDateString(data.dateOfDataCollection)
    };

    const formData = new FormData();
    Object.keys(convertedData).forEach(key => formData.append(key, convertedData[key]));
    if (files.length > 0) {
        formData.append('childImage', files[0]);
    }

        if (navigator.onLine) {
            await addChildData(formData);
        }else{
            // Save data to IndexedDB
            await saveToIndexedDB(convertedData, files[0]);
        }
    }

    const onClose = () => {
        navigate(-1);
    }

    const handleDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(files.filter(file => file !== fileToRemove));
    };

    return (
        <>
            <Box m="20px">
                <Header title="Child Data Collection" subtitle="Child Data Collection Form" />
                <Card>
                    <StickTopStepper
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        steps={steps}
                        isViewMobile={false}
                    />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box>

                            <Box mt={4} ref={personalInformationRequestRef}>
                                <BorderedSection title="Personal Information">
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12} mt={1}>
                                            <CustomTextField
                                                label="Child's First Name"
                                                control={control}
                                                controllerName="childFirstName"
                                                name="firstName"
                                                rules={{ required: "Child's First Name is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Grid item md={12} xs={12} mt={1}></Grid>
                                            <CustomTextField
                                                label="Child's Last Name"
                                                control={control}
                                                controllerName="childLastName"
                                                name="lastName"
                                                fullWidth
                                                rules={{ required: "Child's Last Name is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={1}>
                                            <CustomDatePicker
                                                controllerName={"dateOfBirth"}
                                                control={control}
                                                label="Date of Birth"
                                                rules={{ required: "Date of Birth is required." }}
                                                onChange={(e) => { console.log("Date") }}
                                                onClose={() => { console.log("Close") }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={1}>
                                            <CustomTextField
                                                label="Parent/Guardian's Name"
                                                control={control}
                                                controllerName="parentName"
                                                name="parentName"
                                                rules={{ required: "Parent/Guardian's Name is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={2} xs={12}>
                                            <Typography>Gender</Typography>
                                            <CustomRadioButton
                                                controllerName={"gender"}
                                                control={control}
                                                options={patientGenderOptions}
                                                rules={{ required: "Gender is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={1}>
                                            <CustomTextField
                                                label="Address"
                                                control={control}
                                                controllerName="address"
                                                name="address"
                                                rules={{ required: "Address is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={4} xs={12} mt={1}>
                                            <CustomPatternTextField
                                                control={control}
                                                name="mobile"
                                                label="Mobile Number"
                                                rules={{ required: "Mobile Number is required." }}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12} mt={1}>
                                        <Dropzone onDrop={handleDrop} accept="image/*" />
                                            <ul>
                                                {files.map((file, index) => (
                                                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                        {file.name}
                                                        <IconButton onClick={() => handleRemoveFile(file)} color="error">
                                                            <DeleteForeverOutlined />
                                                        </IconButton>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Grid>
                                    </Grid>
                                </BorderedSection>

                                <Box mt={4} ref={healthInformationRequestRef}>
                                    <BorderedSection title="Health Information">
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Height"
                                                    control={control}
                                                    controllerName="height"
                                                    name="height"
                                                    rules={{
                                                        required: "Height is required.",
                                                        pattern: { value: /^[0-9]+$/, message: "Height must be a number" }
                                                      }}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Weight"
                                                    control={control}
                                                    controllerName="weight"
                                                    name="weight"
                                                    rules={{
                                                        required: "Weight is required.",
                                                        pattern: { value: /^[0-9]+$/, message: "Weight must be a number" }
                                                      }}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Head Circumference Body Mass Index (BMI)"
                                                    control={control}
                                                    controllerName="bmi"
                                                    name="bmi"
                                                    rules={{
                                                        required: "BMI is required.",
                                                        pattern: { value: /^[0-9]+$/, message: "BMI must be a number" }
                                                      }}
                                                />
                                            </Grid>

                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Birth Weight"
                                                    control={control}
                                                    controllerName="birthWeight"
                                                    name="birthWeight"
                                                    rules={{
                                                        pattern: { value: /^[0-9]+$/, message: "Birth Weight must be a number" }
                                                      }}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Vaccination Status"
                                                    control={control}
                                                    controllerName="vaccinationStatus"
                                                    name="vaccinationStatus"
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Supplementary feeding status"
                                                    control={control}
                                                    controllerName="feedingStatus"
                                                    name="feedingStatus"
                                                    rules={{ required: "Mobile Number is required." }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Any existing health conditions"
                                                    control={control}
                                                    controllerName="healthConditions"
                                                    name="healthConditions"
                                                    multiline rows={4} maxRows={4}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Dietary habits"
                                                    control={control}
                                                    controllerName="dietryHabits"
                                                    name="dietryHabits"
                                                    multiline rows={4} maxRows={4}
                                                />
                                            </Grid>
                                        </Grid>
                                    </BorderedSection>

                                </Box>

                                <Box mt={4} ref={environmentalInformationRequestRef}>
                                    <BorderedSection title="Environmental Information">
                                        <Grid container spacing={2}>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    controllerName={"socioeconomicStatus"}
                                                    control={control}
                                                    label="Socioeconomic status"
                                                    name="socioeconomicStatus"
                                                    rules={{ required: "Socioeconomic status is required." }}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    controllerName={"sanitizationFacs"}
                                                    control={control}
                                                    label="Sanitation facilities"
                                                    rules={{ required: "Sanitation facilities is required." }}
                                                    onChange={(e) => { console.log("Date") }}
                                                    onClose={() => { console.log("Close") }}
                                                />
                                            </Grid>
                                            <Grid item md={4} xs={12} mt={1}>
                                                <CustomTextField
                                                    controllerName={"waterSource"}
                                                    control={control}
                                                    label="Water source"
                                                    rules={{ required: "Water source is required." }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    controllerName={"houseSize"}
                                                    control={control}
                                                    label="Household size"
                                                    rules={{
                                                        required: "Household size is required",
                                                        min: { value: 1, message: "Household size must be at least 1" },
                                                        max: { value: 20, message: "Household size must be less than or equal to 20" },
                                                        pattern: { value: /^[0-9]+$/, message: "Household size must be a number" }
                                                      }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    controllerName={"accessToHealthcare"}
                                                    control={control}
                                                    label="Access to healthcare services"
                                                    rules={{ required: "Access to healthcare services is required." }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </BorderedSection>
                                </Box>

                                <Box mt={4} ref={additionalInformationRequestRef}>
                                    <BorderedSection title="Additional Information">
                                        <Grid container spacing={2}>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomDatePicker
                                                    controllerName={"dateOfDataCollection"}
                                                    control={control}
                                                    label="Date of data collection"
                                                    rules={{ required: "Date of Collection is required." }}
                                                    onChange={(e) => { console.log("Date") }}
                                                    onClose={() => { console.log("Close") }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Name of the Collector"
                                                    control={control}
                                                    controllerName="collectorName"
                                                    name="collectorName"
                                                    rules={{ required: "Name of the Collector is required." }}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12} mt={1}>
                                                <CustomTextField
                                                    label="Location of Data Collection"
                                                    control={control}
                                                    controllerName="collectionLocation"
                                                    name="collectionLocation"
                                                />
                                            </Grid>
                                        </Grid>
                                    </BorderedSection>
                                </Box>
                                <Grid item md={12} xs={12} mt={1}></Grid>
                                <Grid
                                    container
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    <Grid item xs={12} md="auto">
                                        <Button
                                            type="submit"
                                            color="info"
                                            startIcon={<SaveOutlined />}
                                            fullWidth
                                        >
                                            Submit Data
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md="auto">
                                        <Button
                                            color="error"
                                            startIcon={<CancelOutlined />}
                                            onClick={() => onClose()}
                                            fullWidth
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </form>
                </Card>
            </Box>
        </>
    )
}

export default Form