import React, { ReactElement } from "react";

export default async function BeneficiariesLayout({ children, }: { children: React.ReactNode; }) {

   interface Data {
      id:                       number;
      first_name:               string;
      second_name:              string;
      last_name:                string;
      mothers_last_name:        string;
      identity_card:            string;
      due_date:                 Date;
      is_duedate_undefined:     boolean;
      gender:                   string;
      civil_status:             string;
      birth_date:               Date;
      death_certificate:        null;
      death_certificate_number: string;
      reason_death:             string;
      phone_number:             number;
      nua:                      null;
      account_number:           null;
      sigep_status:             null;
      id_person_senasir:        number;
      date_last_contribution:   Date;
   }

   // interface ChildProps {
   //    data: Data | any
   // }

   // const data = await fetch('http://192.168.2.194:3080/api/persons').then((res) => res.json());

   // const childWithProps = React.Children.map(children, child => {
   //    if (React.isValidElement(child)) {
   //       return React.cloneElement(child as ReactElement<ChildProps>, { data });
   //    }
   //    return child;
   // });
   return (
      <div>
         {/* <div>
            <h1>Datos obtenidos:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
         </div> */}
         {/* {childWithProps} */}
         { children }
      </div>
   )
}