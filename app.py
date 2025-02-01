from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash  # For password hashing
from bson import ObjectId  # For converting MongoDB ObjectId

from werkzeug.utils import secure_filename
import os


app = Flask(__name__)
app.secret_key = 'saru'  # Ensure to use a strong secret key for session and flash messages


# Flask-PyMongo setup
app.config['MONGO_URI'] = 'mongodb://localhost:27017/lungimage'  # MongoDB URI, replace with your actual URI
# Directory to save uploaded images
app.config["UPLOAD_FOLDER"] = 'uploads'  # Folder where files are temporarily saved
# Allowed file types
app.config["ALLOWED_EXTENSIONS"] = {'png', 'jpg', 'jpeg', 'gif'}

mongo = PyMongo(app) # Create an instance of PyMongo

# Define MongoDB collections
users_collection = mongo.db.users
images_collection = mongo.db.images


# Connect to MongoDB collections
users_collection = mongo.db.users  # Access the 'users' collection from the database
images_collection = mongo.db.images

@app.route('/')
def home():
    return render_template('welcome.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        age = request.form['age']
        gender = request.form['gender']

        # Check if the user already exists
        existing_user = users_collection.find_one({'username': username})
        if existing_user:
            flash("Username already exists, try another one", 'danger')
            return redirect(url_for('register'))

        # Hash the password before storing it
        hashed_password = generate_password_hash(password)

        # Store the user's data in MongoDB
        mongo.db.users.insert_one({
            'username': username,
            'password': hashed_password,
            'age': age,
            'gender': gender
        })

        # Save user details in MongoDB
        # users_collection.insert_one({'username': username, 'password': hashed_password})
        flash("Registration successful! Please log in.", 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Check if the username exists
        user = users_collection.find_one({'username': username})
        if not user:
            flash('Account does not exist. Please register first.', 'warning')
            return redirect(url_for('register'))

        # Check if the password is correct
        if check_password_hash(user['password'], password):
            session['user_id'] = str(user['_id'])  # Store user ID in session
            flash('Login successful! Redirecting to your dashboard.', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password, try again', 'danger')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'user_id' not in session:  # Check if the user is logged in
        flash('You must be logged in to view the dashboard.', 'warning')
        return redirect(url_for('login'))  # Redirect to login page if not logged in

    user_id = session['user_id']
    user = users_collection.find_one({'_id': ObjectId(user_id)})  # Get user data from MongoDB using ObjectId

    # Fetch images and predictions for the user
    user_images = list(images_collection.find({'user_id': user_id}))  # Fetch images for the user as a list
    
    if request.method == 'POST':
        # Handle file upload
        if 'image' not in request.files:
            flash('No file selected.', 'danger')
            return redirect(url_for('dashboard'))

        file = request.files['image']
        
        if file.filename == '':
            flash('No file selected.', 'danger')
            return redirect(url_for('dashboard'))

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
        # Ensure the upload folder exists
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])  # Create the folder if it doesn't exist
            
            
            file.save(file_path)


             # Process the image and make a prediction
            prediction = your_predict_function(file_path)  # Implement your_predict_function
            print(f"Prediction: {prediction}")  # Debugging step

            # Store the image and prediction in MongoDB
            insert_result = images_collection.insert_one({
                'user_id': user_id,
                'image_path': file_path,
                'prediction': prediction
            })
            print(f"Inserted image with ID: {insert_result.inserted_id}")  # Debugging step

            flash('Image uploaded and prediction stored successfully!', 'success')
            return redirect(url_for('dashboard'))

    return render_template('dashboard.html', user=user, user_images=user_images)



@app.route('/logout')
def logout():
    session.clear()  # Clear the session
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))


@app.route('/about')
def about():
    return render_template('about.html')  # Make sure you have the about.html file


@app.route('/home')
def welcome():
    return render_template('home.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')  # Or the appropriate template for the contact page


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


if __name__ == '__main__':
    app.run(debug=True)
