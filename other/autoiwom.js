// ==UserScript==
// @name     Auto iWom 2021 + Cats
// @version  1.3.5
// @include https://www.bpocenter-dxc.com/iwom_web4/es-corp/app/Jornada/Reg_jornada.aspx
// @grant    none
// ==/UserScript==
var final_message = "<img style='max-width:100%;' src='https://cataas.com/cat/gif?"+ new Date().getTime() +"' alt='Random Cat'/>";
var hora_inicio, minuto_inicio, hora_final, minuto_final, horas_informadas, horas_efectivas;

if (document.getElementById("ctl00_Sustituto_L_error").innerHTML !== "") {
    final_message = "<p>No se ejecuta AutoiWom porque ya estaba guardado previamente.</p>" + final_message;
} else {
    var date = document.getElementById('ctl00_Sustituto_T_dia').value;
    var currentDate = new Date(date.substring(6,10), parseInt(date.substring(3,5) - 1), date.substring(0,2));
    var currentMonth = currentDate.getMonth();

    // July & August
    if (currentMonth == 6 || currentMonth == 7){
        hora_inicio = "8";
        minuto_inicio = "0";
        hora_final = "15";
        minuto_final = "0";

        horas_informadas = "07:00";
        horas_efectivas = "07:00";

    } else { // Rest of the year
        // It's Friday!!
        if(currentDate.getDay() == 5){
            hora_inicio = "8";
            minuto_inicio = "0";
            hora_final = "15";
            minuto_final ="0";

            horas_informadas = "07:00";
            horas_efectivas = "07:00";
        } else {
            hora_inicio = "8";
            minuto_inicio = "0";
            hora_final = "17";
            minuto_final ="20";

            horas_informadas = "09:20";
            horas_efectivas = "08:20";
        }
    }

    document.getElementById("ctl00_Sustituto_d_hora_inicio1").value = hora_inicio;
    document.getElementById("ctl00_Sustituto_D_minuto_inicio1").value = minuto_inicio;
    document.getElementById("ctl00_Sustituto_d_hora_final1").value = hora_final;
    document.getElementById("ctl00_Sustituto_d_minuto_final1").value = minuto_final;
    document.getElementById("ctl00_Sustituto_T_horas").value = horas_informadas;
    document.getElementById("ctl00_Sustituto_T_efectivo").value = horas_efectivas;

    document.getElementById("ctl00_Sustituto_Btn_Guardar").dispatchEvent(new MouseEvent('click'));

    final_message = "<p>Guardado correctamente mediante AutoiWom.</p>" + final_message;
}

document.getElementById("ctl00_Sustituto_L_error").style.color = "Blue";
document.getElementById("ctl00_Sustituto_L_error").innerHTML = final_message;
