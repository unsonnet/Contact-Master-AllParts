<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

  $inData = getRequestInfo();
  $conn = new mysqli("localhost", "superUser", "Hack34", "ContactMaster");

  if ($conn->connect_error) {
    returnWithError($conn->connect_error);
  } else {
    $stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password=?;");
    $stmt->bind_param("ss", $inData["login"], $inData["password"]);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()){
      returnWithInfo($row["ID"], $row["FirstName"], $row["LastName"]);

      $stmt = $conn->prepare("UPDATE Users SET DateLastLoggedIn=CURRENT_TIMESTAMP() WHERE ID=?;");
      $stmt->bind_param("i", $row["ID"]);
      $stmt->execute();
    } else {
      returnWithError("No Records Found");
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
    $retValue = '{"id":0, "firstName":"", "lastName":"", "error":"'.$err.'"}';
    sendResultInfoAsJson($retValue);
  }
  
  function returnWithInfo($id, $firstName, $lastName) {
    $retValue = '{"id":'.$id.', "firstName":"'.$firstName.'", "lastName":"'.$lastName.'", "error":""}';
    sendResultInfoAsJson($retValue);
  } 
?>
