<?php

	$inData = getRequestInfo();
	
    $email = "";
    $fullName = $inData["fullName"];
    $currentID = $inData["ID"];
    $phoneNumber = "";
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "superUser", "Hack34", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "DELETE FROM Contacts WHERE fullName = '" . $fullName . "'";
        
        if( $result = $conn->query($sql) != TRUE )
        {
            returnWithError("Delete unsuccessful");
        }
        else
        {
            returnWithInfo("Deleted");
        }
        $conn->close();
    }


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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $err )
    {
        $retValue = '{"success":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>