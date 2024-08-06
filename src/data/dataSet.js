import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const UseChartData = () => {
  const [chartData, setChartData] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [date, setDate] = useState("2024-08-01");
  const [userId, setUserId] = useState(null);
  const [LeaderShip, setLeaderShip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);

  const location = useLocation();
  const userIdStorage = localStorage.getItem("userIdStorage");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "candidate") {
      setUserId(userIdStorage);
    }
  }, [role]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idUser = params.get("userId");
    if (idUser) {
      setUserId(idUser);
    }
  }, [location]);

  const labelVA = [
    "Leader",
    "Qualités",
    "Efforts",
    "Potentiel",
    "Satisf-Pro",
    "Dev-Pro",
  ];
  const labels = [
    // "Vous aujourd'hui"
    ...labelVA,
    // "Vos valeurs"
    "Indépendance",
    "Défi",
    "Créativité",
    "Instruction",
    "Plaisir",
    "Responsabil",
    "Cooperat",
    "Accomplis",
    "Reconnaiss",
    "Richesse",
    "Courage",
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
    "Comm-Oral",
    "Écoute",
    "Préparer",
    "Comprendre",
    "Comm-Details",
    "Feedback",
    "Ressenti",
    "Comm-Écrite",
    "Stress-mgt",
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
    "Confronté",
    "Humour",
    "Optimiste",
    "Opportunité",
    "Rôle",
    "Innov-Creat",
    "Partg-Emoti",
    "Repon-Contruc",
    "Vengeance",
    "Solui-Satisf",
    // "Résilience"
    "Atouts",
    "Defis-Perso",
    "Agir-Authta",
    "Prendr-soin",
    "Orig-Stress",
    "Adapt-Chang",
    "Rebondir",
    "Degre",
    "Collaboratio",
    "Quali-Soutien",
    // "Vous-même"
    "Physique",
    "Mental",
    "Spirituel",
    "Regard-Soi",
    "Paix-Inter",
    "Epanouiss",
    "Crainte",
    "Image-Projt",
    "Negativité",
    "Adversité",
    "Ruminer",
    "Souhai-Être",
    "Cohérence",
    "Vie Privée",
    "Complétude",
    "Adap-Tecno",
    // "Dans le futur"
    "Volonté",
    "Avenir-Clair",
    "Rem-en-quest",
    "Mgt-Ambig",
    "Curiosité",
    "Contribuer",
    "Amélior-Pratq",
    "Incertitude",
  ];

  const formatDate = (dateString) => {
    return dateString.split("T")[0]; // Extract the date part "YYYY-MM-DD"
  };

  const formatDateToISOString = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const getUserTestsByUserId = async (userId) => {
    //role === "candidate"
    try {
      const userTestsRef = collection(db, "UserTests");
      let q = null;
      if (role === "candidate") {
        q = query(
          userTestsRef,
          where("userId", "==", userId),
          where("sharedState", "==", true)
        );
      } else {
        q = query(userTestsRef, where("userId", "==", userId));
      }

      const querySnapshot = await getDocs(q);

      const userTests = querySnapshot.docs?.slice(0, 2).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestData(userTests);

      return userTests;
    } catch (error) {
      console.error("Error fetching UserTests: ", error);
      return [];
    }
  };

  const getCategoriesByTestId = async (testId) => {
    try {
      const testDocRef = doc(db, "Tests", testId);
      const testDoc = await getDoc(testDocRef);
      if (testDoc.exists()) {
        const testData = testDoc.data();
        return testData.categories;
      } else {
        console.log(`Test with ID ${testId} not found`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching test categories: ", error);
      return [];
    }
  };

  const getUserTestsAndCategories = async (userId) => {
    try {
      setLoading(true);
      const userTests = await getUserTestsByUserId(userId);
      const testsWithCategories = await Promise.all(
        userTests.map(async (userTest) => {
          const categories = await getCategoriesByTestId(userTest.testId);
          return {
            ...userTest,
            categories,
          };
        })
      );
      setLoading(false);
      return testsWithCategories;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    let combinedData = [];

    const result = await getUserTestsAndCategories(userId);
    if (result?.length === 0) return;
    const getResponsesByCategoryIdAndDate = (dataObj, categoryId, testDate) => {
      if (!!!dataObj) return;
      const testDateFormatted = formatDate(testDate);
      const result = {};

      // Trouve la catégorie spécifique par categoryId
      const category = dataObj.categories.find(
        (cat) => cat.category === categoryId
      );
      if (category) {
        // Extrait les réponses de la catégorie
        result.responses = category.responses.map(
          (response) => response.response
        );
        result.testId = dataObj.testId;
        result.userId = dataObj.userId;
        result.testDate = dataObj.testDate;
        result.sharedState = dataObj.sharedState;
      }

      return result;
    };
    const testDate = "2024-08-01";

    //Votre Leadership Aujourd’hui;
    const VOTRELEADERSHIP = getResponsesByCategoryIdAndDate(
      result?.[0],
      "4jx2EMzabASVxfbKBKxQ",
      testDate
    )?.responses;

    //Vos valeurs
    const VALEURS = getResponsesByCategoryIdAndDate(
      result?.[0],
      "Kn1O3C6oUTXlgyWn5utY",
      testDate
    )?.responses;

    // Etat d'esprit
    const ES = getResponsesByCategoryIdAndDate(
      result?.[0],
      "M1zQrDhFj0LYbyYVCs1H",
      testDate
    )?.responses;

    //Communication
    const COM = getResponsesByCategoryIdAndDate(
      result?.[0],
      "u18ckyczskXpvLmQ9wCV",
      testDate
    )?.responses;

    //confiance
    const CONFIANCE = getResponsesByCategoryIdAndDate(
      result?.[0],
      "yz0kVA4XJ1Ivd1eFmIHZ",
      testDate
    )?.responses;
    //Conflit
    const CONFLIT = getResponsesByCategoryIdAndDate(
      result?.[0],
      "rYbeaMIQuKar27QYsXVG",
      testDate
    )?.responses;
    //résilience
    const RESILIENCE = getResponsesByCategoryIdAndDate(
      result?.[0],
      "yyZWreYDX93rPRnjIkwh",
      testDate
    )?.responses;

    //Vous-même
    const VOUSMEME = getResponsesByCategoryIdAndDate(
      result?.[0],
      "wClgeAd1l2hqzfw5l4aV",
      testDate
    )?.responses;

    //
    const FUTUR = getResponsesByCategoryIdAndDate(
      result?.[0],
      "PC6KaYF98rIsfNwH2FTC",
      testDate
    )?.responses;

    const newPeriodData = [
      7, 6, 5, 4, 8, 9, 2, 7, 5, 6, 3, 8, 9, 4, 5, 3, 6, 8, 7, 5, 4, 3, 8, 7, 6,
      4, 5, 3, 7, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6, 3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2,
      6, 5, 3, 7, 8, 4, 6, 3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6,
      3, 9, 5, 8, 7, 6, 4, 3, 8, 9, 2, 6, 5, 3, 7, 8, 4, 6, 3, 9, 5,
    ];

    // Combine all datasets into one continuous array
    combinedData = [
      ...VOTRELEADERSHIP,
      ...VALEURS,
      ...ES,
      ...COM,
      ...CONFIANCE,
      ...CONFLIT,
      ...RESILIENCE,
      ...VOUSMEME,
      ...FUTUR,
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
          labelVA,
        },
        /*   {
          label: "Vous 2023",
          backgroundColor: "rgba(50, 150, 226, 0.1)",
          borderColor: "#0d47a1",
          borderWidth: 2,
          pointBackgroundColor: "#1E90FF",
          pointHoverBackgroundColor: "#1E90FF",
          pointHoverBorderColor: "#1E90FF",
          data: fullNewPeriodData,
        }, */
      ],
    };

    setChartData(formattedData);
  };

  useEffect(() => {
    fetchData();
  }, [userId, date]);

  return { chartData, loading, testData };
};

export default UseChartData;
