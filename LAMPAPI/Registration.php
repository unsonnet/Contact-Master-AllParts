<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	
	$inData = getRequestInfo();
	$conn = new mysqli("localhost", "superUser", "Hack34", "ContactMaster");  
	
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		$stmt = $conn->prepare("INSERT IGNORE INTO Users (FirstName,LastName,Login,Password) VALUES (?,?,?,?);");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
		$stmt->execute();

		if ($conn->affected_rows == 0) {
			returnWithError("Username Unavailable");
		} else {
			returnWithInfo($conn->insert_id);
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err) {
		$retValue = '{"id":0, "error":"'.$err.'"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($id) {
		$retValue = '{"id":"'.$id.'", "error":""}';
		sendResultInfoAsJson($retValue);
	}
?>