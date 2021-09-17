<?php

	$inData = getRequestInfo();
	
	$email = "";
    $fullName = $inData["fullName"];
    $phoneNumber = "";
    $searchResults = "";
    $numResults = 0;

	$conn = new mysqli("localhost", "superUser", "Hack34", "ContactManager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT firstName,lastName,email,phoneNumber FROM Contacts where fullName like '%" . $fullName . "%'";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0)
        {
            while($row = $result->fetch_assoc())
            {
                if ($numResults > 0)
                {
                    $searchResults .= ",";
                }
                $numResults++;
                $searchResults .= '"' . $row["firstName"] . '",';
                $searchResults .= '"' . $row["lastName"] . '",';
                $searchResults .= '"' . $row["email"] . '",';
                $searchResults .= '"' . $row["phoneNumber"] . '"';
            }
            
            returnWithInfo($searchResults);
        }
        //otherwise return an error that none were found
        else
        {
            returnWithError("No contacts found.");

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
        $retValue = '{"firstName": "","lastName":"","email":"","phoneNumber":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
	
?>
