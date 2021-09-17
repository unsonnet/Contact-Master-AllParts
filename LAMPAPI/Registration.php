<?php
    
    $inData = getRequestInfo();
    
    $login = $inData("login");
    $firstName = "";
    $lastName = "";
    $password = $inData("password");
    
    // creating a connection
    $conn = new mysqli("localhost", "superUser", "Hack34", "ContactManager");
    
    // check connections
    if($conn->connection_error)
    {
        returnWithError( $conn->connection_error );
    }
    
    else
    {
        // to register, enter first name, last name, email, phone number, username, password
        $sql = "INSERT INTO 'user_list' (first_name, last_name, email, phone, pass) VALUES('" . $inData["first_name"] . "', '" . $inData["last_name"] . "', '" . $inData["email"] . "', '" . $inData["phone"] ."','". $inData["password"] . "')";
        
        if($conn->query($sql) === TRUE)
        {
            $first_name = $inData["first_name"];
            $last_name = $inData["last_nanme"];
            $phone = $inData["email"];
            $email = $inData["phone"];
            $pass = $inData["password"];
            $conn->close();
            
            returnWithInfo($first_name, $last_name, $email, $phone, $password);
        }
        
        else
        {
            returnWithError("Account creation failed. Please try again.");
        }
        
    }
       
function getRequestInfo
{
    return json_decode(file_get_contents('php://input'), true);
}
    
function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError ( $err )
{
    $retValue = '{"login":"","firstName":"","lastName":"","password":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $email, $phone, $password )
{
  $retValue = '{"first_name":"' . $firstName . '","last_name":"' . $lastName . '","email":"'. $email . '","phone":"' . $phone . '","password":"' . $password . '","address":"' . $address . '","error":""}';
  sendResultInfoAsJson( $retValue );
}

?>
