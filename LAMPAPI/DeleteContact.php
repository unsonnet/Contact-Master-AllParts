<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
	header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
	
	$inData = getRequestInfo();
	$conn = new mysqli("localhost", "superUser", "Hack34", "ContactMaster");  
	
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?;");
		$stmt->bind_param("ii", $inData["contactid"], $inData["userid"]);
		$stmt->execute();

		if ($conn->affected_rows == 0) {
			returnWithError("No Change");
		} else {
			returnWithError("");
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
		$retValue = '{"error":"'.$err.'"}';
		sendResultInfoAsJson($retValue);
	}
?>