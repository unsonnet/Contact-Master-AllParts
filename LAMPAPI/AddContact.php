<?php
    
    $inData = getRequestInfo();
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNumber = $inData["phoneNumber"];
    $fullName = $firstName;
    $fullName .= " ";
    $fullName .= $lastName;

    // connect to server
    $conn = new mysqli("localhost", "superUser", "Hack34", "ContactManager");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }

    else
    {
        $sql = "SELECT firstName,lastName,email,phoneNumber FROM Contacts where fullName='" . $fullName . "' and email= '" . $email . "' and phoneNumber= '" . $phoneNumber . "' and userID= '" . $currentID . "'";
        $result = $conn->query($sql);
        // Such a contact already exists
        if ($result->num_rows > 0)
        {
            returnWithError("Contact with this information already exists.");
        }
        //otherwise add into user's database
        else
        {
            $sql = "INSERT into Contacts (firstName,lastName,phoneNumber,email,userID,fullName) VALUES ('" . $firstName . "','" . $lastName . "','" . $phoneNumber . "','" . $email . "','" . $fullName . "')";

            // Check if insertion was unsuccessful
            if( $result = $conn->query($sql) != TRUE )
            {
                returnWithError( $conn->error );
            }

        }

        $conn->close();
    }

    returnWithError("");

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"login":"","firstName":"","lastName":"","password":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>
