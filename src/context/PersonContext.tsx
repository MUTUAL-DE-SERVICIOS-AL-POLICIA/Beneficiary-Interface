"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { CityBirth, FinancialEntity, PensionEntity, Person } from "@/utils/interfaces";
import { apiClient } from "@/services";

interface PersonContextProps {
  person: Person;
  affiliateId: string;
  financialEntity: FinancialEntity;
  pensionEntity: PensionEntity;
  cityBirth: CityBirth;

  photoUrl: string | null;
  loadPhoto: () => Promise<void>;
  clearPhoto: () => void;
}

const PersonContext = createContext<PersonContextProps | undefined>(undefined);

PersonContext.displayName = "PersonContext";

export const PersonProvider: React.FC<{
  person: Person;
  affiliateId: string;
  financialEntity: FinancialEntity;
  pensionEntity: PensionEntity;
  cityBirth: CityBirth;
  children: ReactNode;
}> = ({ person, financialEntity, pensionEntity, cityBirth, affiliateId, children }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const loadPhoto = async () => {
    try {
      const response = await apiClient.GET(`beneficiaries/persons/${person.id}/photo`);

      if (!response.ok) {
        return;
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      setPhotoUrl((oldUrl) => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }

        return url;
      });
    } catch {
      alert("Error al cargar la foto");
    }
  };

  const clearPhoto = () => {
    setPhotoUrl((oldUrl) => {
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      return null;
    });
  };

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  useEffect(() => {
    let isMounted = true;

    const fetchPhoto = async () => {
      if (!person.personPhoto) {
        setPhotoUrl((oldUrl) => {
          if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
          }

          return null;
        });

        return;
      }

      try {
        const response = await apiClient.GET(`beneficiaries/persons/${person.id}/photo`);

        if (!response.ok || !isMounted) {
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (isMounted) {
          setPhotoUrl((oldUrl) => {
            if (oldUrl) {
              URL.revokeObjectURL(oldUrl);
            }

            return url;
          });
        }
      } catch {
        if (isMounted) {
          alert("Error al cargar la foto");
        }
      }
    };

    fetchPhoto();

    return () => {
      isMounted = false;
    };
  }, [person.id, person.personPhoto]);

  return (
    <PersonContext.Provider
      value={{
        person,
        financialEntity,
        pensionEntity,
        cityBirth,
        affiliateId,
        photoUrl,
        loadPhoto,
        clearPhoto,
      }}
    >
      {children}
    </PersonContext.Provider>
  );
};

export const usePerson = () => {
  const context = useContext(PersonContext);

  if (!context) {
    throw new Error("usePerson debe usarse dentro de un PersonProvider");
  }

  return context;
};
