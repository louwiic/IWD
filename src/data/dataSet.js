import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const UseChartData = () => {
  const [chartData, setChartData] = useState(null);
  const query = useQuery();
  const userId = query.get("userId");

  const fetchData = async () => {
    const labels = [
      // "Vous aujourd'hui"
      "Leader",
      "Qualités",
      "Efforts",
      "Potentiel",
      "Satisf-Pro",
      "Dev-Pro",
      // "Vos valeurs"
      "Amitié",
      "Honnêteté",
      "Créativité",
      "Apprentissa",
      "Plaisir",
      "Responsabil",
      "Organis",
      "Réalisation",
      "Reconnaiss",
      "Richesse",
      "Sécurité",
      "Tranqui",
      // "Etat d'esprit"
      "Passion",
      "Action",
      "Atteindre",
      "Risque",
      "Réussir",
      "Complexité",
      "Impact",
      "Emotion",
      "Discipline",
      // "Communication"
      "Ecoute",
      "Preparer",
      "Comprendre",
      "Comm-Details",
      "Feedback",
      "Ressenti",
      "Comm-Ecrite",
      "Stress-Mgt",
      // "Confiance"
      "Expri-Conf",
      "Démo-Conf",
      "Information",
      "Délég-Autor",
      "Maint-Limit",
      "Tenir-Parol",
      "Admet-Err",
      "Appliq-Comp",
      "Conf-Autres",
      // "Conflit"
      "Vengeance",
      "Repon-Contruc",
      "Partg-Emoti",
      "Innov-Creat",
      "Rôle",
      "Opportunité",
      "Optimiste",
      "Humour",
      "Quali-Soutien",
      // "Résilience"
      "Prendr-soin",
      "Collaboratio",
      "Degre",
      "Rebondir",
      "Adapt-Chang",
      "Orig-Stress",
      "Agir-Authta",
      "Defis-Perso",
      "Atouts",
      // "Vous-même"
      "Adap-Tecno",
      "Complétude",
      "Vie Privée",
      "Cohérence",
      "Souhai-Être",
      "Ruminer",
      "Adversité",
      "Negativité",
      "Image-Projt",
      "Crainte",
      "Epanouiss",
      "Paix-Inter",
      "Regard-Soi",
      "Spirituel",
      "Mental",
      "Physique",
      "Amélior-Prata",
      "Incertitude",
      // "Dans le futur"
      "Contribuer",
      "Curiosité",
      "Mgt-Ambig",
      "Rem-en-quest",
      "Avenir-Clair",
      "Volonté",
    ];
    /* 
    const testDocRef = doc(collection(db, "Tests"), userId);
    const testDoc = await getDoc(testDocRef);

    if (!testDoc.exists()) {
      console.error("No such document!");
      return;
    }

    const testData = testDoc.data();
    const categoriesData = testData.categories || [];

    const questionsSnapshot = await getDocs(collection(db, "questions"));
    const categoriesMapping = {};
    questionsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      categoriesMapping[data.id] = data.category;
    });

    function getResponsesByCategory(categoryId) {
      // Filtrer les données par category ID
      const categoryData = categoriesData.find(
        (item) => item.category === categoryId
      );
      if (categoryData) {
        return categoryData.responses;
      } else {
        return [];
      }
    }
 */
    //Vous, en tant que leader
    const categLeader = "4jx2EMzabASVxfbKBKxQ";
    const categValeur = "Kn1O3C6oUTXlgyWn5utY";
    /*  const meToday = getResponsesByCategory(categLeader)?.map(
      (res) => res?.response
    );
    const valeurs = getResponsesByCategory(categValeur)?.map(
      (res) => res?.response
    ); */
    /*  const ES = getResponsesByCategory(categLeader)?.map((res) => res?.response);
    const COM = [];
    const CONFIANCE = [];
    const CONFLIT = [];
    const RESILIENCE = [];
    const VOUSMEME = [];
    const FUTUR = [];

    console.log(" *** meToday ***", meToday); */

    const meToday = [9, 5, 8, 3, 4, 2]; // 6 valeurs
    const valeurs = [8, 5, 5, 4, 3, 2, 1, 6, 9, 9, 5, 7]; // 12 valeurs
    const ES = [6, 6, 7, 4, 7, 5, 1, 6, 9]; // 9 valeurs
    const COM = [4, 5, 3, 0, 8, 7, 7, 9]; // 8 valeurs
    const CONFIANCE = [4, 5, 3, 2, 8, 7, 7, 9, 7]; // 9 valeurs
    const CONFLIT = [0, 6, 7, 4, 7, 5, 1, 6, 9]; // 9 valeurs
    const RESILIENCE = [4, 5, 3, 2, 8, 7, 7, 9, 5]; // 9 valeurs
    const VOUSMEME = [8, 4, 5, 3, 7, 8, 6, 6, 2, 9, 4, 5, 3, 6, 7, 9, 4, 5]; // 18 valeurs
    const FUTUR = [4, 5, 3, 6, 8, 7, 9]; // 7 valeurs

    /*   const volonté = 5; */

    const newPeriodData = [
      7, 6, 5, 4, 8, 9, 2, 7, 5, 6, 3, 8, 9, 4, 5, 3, 6, 8, 7, 5, 4, 3, 8, 7, 6,
      4, 5, 3, 7, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6, 3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2,
      6, 5, 3, 7, 8, 4, 6, 3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6,
      3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6, 3, 9, 5,
    ];

    // Combine all datasets into one continuous array
    const combinedData = [
      ...meToday,
      ...valeurs,
      ...ES,
      ...CONFLIT,
      ...COM,
      ...CONFIANCE,
      ...RESILIENCE,
      ...VOUSMEME,
      ...FUTUR,
      /*       volonté, */
    ];

    // Ensure the combined data has the correct length
    const fullDataLength = labels.length;
    const fullData = Array(fullDataLength).fill(null);
    for (let i = 0; i < combinedData.length; i++) {
      fullData[i] = combinedData[i];
    }

    // Combine the new period data in the same way
    const fullNewPeriodData = Array(fullDataLength).fill(null);
    for (let i = 0; i < newPeriodData.length; i++) {
      fullNewPeriodData[i] = newPeriodData[i];
    }

    const formattedData = {
      labels: labels,
      datasets: [
        {
          label: "Vous aujourd'hui",
          backgroundColor: "rgba(150, 50, 226, 0)",
          borderColor: "#ef5350",
          borderWidth: 2,
          pointBackgroundColor: "#424242",
          pointHoverBackgroundColor: "#424242",
          pointHoverBorderColor: "#424242",
          data: fullData,
        },
        {
          label: "Vous 2023",
          backgroundColor: "rgba(50, 150, 226, 0.1)",
          borderColor: "#0d47a1",
          borderWidth: 2,
          pointBackgroundColor: "#1E90FF",
          pointHoverBackgroundColor: "#1E90FF",
          pointHoverBorderColor: "#1E90FF",
          data: fullNewPeriodData,
        },
      ],
    };

    setChartData(formattedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { chartData };
};

export default UseChartData;
