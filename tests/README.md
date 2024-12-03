# ✨ Amazing Space API Test Suite 🚀

This comprehensive test suite ensures the robustness and reliability of our Space API.  It covers various aspects of the API, from authentication and user metadata to space management and real-time interactions via websockets.  We've used Jest and Axios to create a series of tests that simulate real-world scenarios and validate the API's behavior.

## 📝 Table of Contents

* 🔐 Authentication
* 🧑‍💼 User Metadata Endpoint
* 🖼️ User Avatar Information
* 🌌 Space Information
* 🏟️ Arena Endpoints
* 🌐 Web Socket Tests

## 🔐 Authentication Tests

These tests verify the authentication flow, ensuring that users can sign up, sign in, and are protected from unauthorized access.

* ✅ **Signup:**
    * Users can sign up successfully.
    * Duplicate signups with the same username are prevented.
    * Signups with empty usernames fail.
* ✅ **Signin:**
    * Signin succeeds with correct credentials.
    * Signin fails with incorrect credentials.

## 🧑‍💼 User Metadata Endpoint Tests

These tests check the functionality of updating user metadata, specifically the avatar ID.

* ✅ **Avatar ID Update:**
    * Updates with incorrect avatar IDs fail.
    * Updates with correct avatar IDs succeed.
    * Requests without authorization headers fail.

## 🖼️ User Avatar Information Tests

These tests ensure that avatar information is correctly retrieved and listed.

* ✅ **Avatar Retrieval:**
    * Avatar information for a specific user is retrieved correctly.
* ✅ **Available Avatars:**
    * The recently created avatar is listed among available avatars.


## 🌌 Space Information Tests

These tests validate the creation and deletion of spaces.

* ✅ **Space Creation:**
    * Users can create spaces with a map ID.
    * Users can create empty spaces without a map ID.
    * Space creation fails without dimensions.
* ✅ **Space Deletion:**
    * Deleting non-existent spaces fails.
    * Users can delete their own spaces.
    * Users cannot delete spaces created by others.
* ✅ **Space Listing:**
    * Initially, users have no spaces.
    * Created spaces are correctly listed for the creating user.

## 🏟️ Arena Endpoints Tests

These tests cover the interactions within a space, including element manipulation.

* ✅ **Space Retrieval:**
    * Retrieving a space with an incorrect ID fails.
    * Retrieving a space with a correct ID returns all elements.
* ✅ **Element Deletion:**
    * Elements can be deleted from a space.
* ✅ **Element Addition:**
    * Adding an element outside the space dimensions fails.
    * Adding an element within the space dimensions succeeds.

## 🌐 Web Socket Tests

These tests validate real-time interactions within a space using websockets.

* ✅ **Space Joining:**
    * Clients receive an acknowledgment upon joining a space.
    * Existing users are notified when a new user joins.
* ✅ **Movement:**
    * Movement beyond space boundaries is rejected.
    * Movement more than one unit at a time is rejected.
    * Valid movement is broadcasted to other users in the space.
* ✅ **User Leaving:**
    * Other users are notified when a user leaves the space.


## 🎉 Conclusion

This comprehensive suite of tests ensures the stability and functionality of the Space API.  The use of emojis enhances readability and adds a touch of fun to the documentation! 😄  Regularly running these tests helps maintain the quality of the API and provides confidence in its performance.