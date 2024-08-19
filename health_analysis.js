const addPatientBtn = document.getElementById("addPatient");
const analysisResult = document.getElementById("analysisResultTotal");
const searchBtn = document.getElementById("searchBtn");
const patients = [];

//add patient data function
function addPatient() {
  const patientName = document.getElementById("name").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const patientAge = document.getElementById("age").value;
  const condition = document.getElementById("condition").value;

  const patientData = { patientName, gender, patientAge, condition };
  patients.push(patientData);
  resetForm();
  generateReport();
}

//function to reset values in form
function resetForm() {
  document.getElementById("name").value = "";
  document.querySelector('input[name="gender"]:checked').checked = false;
  document.getElementById("age").value = "";
  document.getElementById("condition").value = "";
  console.log("form reset");
}

//function to generate report
function generateReport() {
  console.log("generating report");
  const totalPatients = patients.length;
  var byConditions = { Diabetes: 0, Thyroid: 0, "High Blood Pressure": 0 };
  var byGender = {
    Male: { Diabetes: 0, Thyroid: 0, "High Blood Pressure": 0 },
    Female: { Diabetes: 0, Thyroid: 0, "High Blood Pressure": 0 },
  };

  patients.forEach((patient) => {
    console.log(patient);

    byConditions[patient.condition]++;
    byGender[patient.gender][patient.condition]++;
  });
  console.log(byConditions);
  console.log(byGender);

  analysisResult.innerHTML = `<table class="table" id="totalPatients">
                                  <tr>
                                    <th scope="row">Number of Patients</th>
                                    <td>${totalPatients}</td>
                                  </tr>
                              </table>`;

  var conditionAnalysis = "";
  var genderAnalysis = "";
  for (const condition in byConditions) {
    console.log(condition);
    console.log(byConditions[condition]);
    conditionAnalysis += `<tr>
                            <th scope="row">${condition}</th>
                            <td>${byConditions[condition]}</td>
                          </tr>`;
  }

  for (const gender in byGender) {
    genderAnalysis += `<tr>
                        <th scope="row" row-span="2">${gender}</th>
                      </tr>`;
    console.log(gender);
    console.log(byGender.gender);
    for (const cond in byGender[gender]) {
      console.log(cond);
      console.log(cond.condition);
      genderAnalysis += `<tr>
                          <th scope="row">${cond}</th>
                          <td>${byGender[gender][cond]}</td>
                        </tr>`;
    }
  }

  analysisResult.innerHTML += `<table class="table" id="analysisResultCondition">
                                ${conditionAnalysis}
                              </table>`;

  analysisResult.innerHTML += `<table class="table" id="analysisResultGender">
                                ${genderAnalysis}
                              </table>`;
}

//function to search condition related information
function searchCondition() {
  const conditionInput = document.getElementById("conditionInput").value;
  const result = document.getElementById("result");
  result.innerHTML = "";

  fetch("./health_analysis.json")
    .then((response) => {
      console.log("receiving data");
      return response.json();
    })
    .then((data) => {
      console.log("data received");
      console.log(data);
      console.log(data.conditions);
      console.log(conditionInput);

      const condition = data.conditions.find(
        (cond) => cond.name.toLowerCase() === conditionInput.toLowerCase()
      );

      if (condition) {
        const symptoms = condition.symptoms.join(", ");
        const prevention = condition.prevention.join(", ");
        const treatment = condition.treatment;

        result.innerHTML += `<h2>${condition.name}</h2>`;
        result.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;
        result.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
        result.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
        result.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
      } else {
        result.innerHTML += `<h2>Condition not Found</h2>`;
      }
    })
    .catch((error) => {
      console.error("An error has occured:", error);
      result.innerHTML = "An error occurred while fetching data.";
    });
}

addPatientBtn.addEventListener("click", addPatient);
searchBtn.addEventListener("click", searchCondition);
