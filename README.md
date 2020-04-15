This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Steps to start the application: 

###  1. `npm install`

Installs the dependencies mentioned in the package.json file.

### 2. `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### 3. `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

## Working of the Application

### `Choose An Image` button

Click on Choose An Image button to select an Image.

The functionality also validates the file selected : 
1. Accepts image files which have resolution 1024 x 1024 exact size.
2. Rejects all other files and displaying an alert box to the user.

### `Image Cropper Buttons`

These buttons gives the user the option to select and crop the images according their wish within the given different size options.

Functionality : 
1. User needs to crop the Image atleast once to be able to upload it to the server.
2. `Highlighted buttons color` depict that the user has cropped the image within the selected range atleast once.
3. Crop Selections are `auto saved` as the user brushes through the original image.
4. `Different button border color` depicts current selection mapping it with the `Preview Button`.
5. `Preview button` shows the preview image in a `Modal` of the selected crop value.
6. `Check boxes` are activated only if the user makes a crop selection atleast once.
7. `Upload button` is used to upload the checked cropped images. `Minimum once checked image is required`. 
8. Images are uploaded to a `Demo Cloudinary Image Storage.`
9. Final Page Shows all the Cropped Images.


**Note 1: For Simplicity Reasons, the App is made in such a way that, if the User wishes to go back or choose a new image, the User has to Refresh the App !**

**Note 2: For best view kindly run this app in large screens with resolution above 1024px.

## Plugins Used:

`react-image-crop` : (https://github.com/DominicTobias/react-image-crop/)


