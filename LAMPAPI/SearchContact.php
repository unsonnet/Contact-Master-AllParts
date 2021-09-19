<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
  
  $inData = getRequestInfo();
  $conn = new mysqli("localhost", "superUser", "Hack34", "ContactMaster");  
  
  if ($conn->connect_error) {
    returnWithError($conn->connect_error);
  } else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND FirstName LIKE ? AND LastName LIKE ? AND Phonenumber LIKE ? AND Email LIKE ?;");
    $stmt->bind_param("issss", $inData["userid"], fuzzy($inData["firstName"]), fuzzy($inData["lastName"]), fuzzy($inData["phonenumber"]), fuzzy($inData["email"]));
    $stmt->execute();

    $result = $stmt->get_result();
    $searchResults = "";
    $searchCount = 0;

    while ($row = $result->fetch_assoc()) {
      if ($searchCount > 0) {
        $searchResults .= ", ";
      }
      $searchCount++;
      $searchResults .= '{"id":'.$row["ID"].', "firstName":"'.$row["FirstName"].'", "lastName":"'.$row["LastName"].'", "phonenumber":"'.$row["Phonenumber"].'", "email":"'.$row["Email"].'"}';
    }

    if ($searchCount == 0) {
      returnWithError("No Records Found");
    } else {
      returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
  }

  function fuzzy($query) {
    return "%".$query."%";
  }

  function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
  }

  function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
  }
  
  function returnWithError($err) {
    $retValue = '{"results":[], "error":"'.$err.'"}';
    sendResultInfoAsJson($retValue);
  }

  function returnWithInfo($searchResults) {
    $retValue = '{"results":['.$searchResults.'], "error":""}';
    sendResultInfoAsJson( $retValue );
  }
?>