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
  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [userId, setUserId] = useState(null);
  const [LeaderShip, setLeaderShip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);
  const [testDates, setTestDates] = useState([]);

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
    ...labelVA,
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
    "Passion",
    "Action",
    "Atteindre",
    "Risque",
    "Réussir",
    "Complexité",
    "Impact",
    "Emotion",
    "Discipline",
    "Comm-Oral",
    "Écoute",
    "Préparer",
    "Comprendre",
    "Comm-Details",
    "Feedback",
    "Ressenti",
    "Comm-Écrite",
    "Stress-mgt",
    "Expri-Conf",
    "Démo-Conf",
    "Information",
    "Délég-Autor",
    "Maint-Limit",
    "Tenir-Parol",
    "Admet-Err",
    "Appliq-Comp",
    "Conf-Autres",
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
    "Volonté",
    "Avenir-Clair",
    "Rem-en-quest",
    "Mgt-Ambig",
    "Curiosité",
    "Contribuer",
    "Amélior-Pratq",
    "Incertitude",
  ];

  const categoryIds = [
    "4jx2EMzabASVxfbKBKxQ", // Leadership
    "Kn1O3C6oUTXlgyWn5utY", // Valeurs
    "M1zQrDhFj0LYbyYVCs1H", // Etat d'esprit
    "u18ckyczskXpvLmQ9wCV", // Communication
    "yz0kVA4XJ1Ivd1eFmIHZ", // Confiance
    "rYbeaMIQuKar27QYsXVG", // Conflit
    "yyZWreYDX93rPRnjIkwh", // Résilience
    "wClgeAd1l2hqzfw5l4aV", // Vous-même
    "PC6KaYF98rIsfNwH2FTC", // Dans le futur
  ];

  // Fonction pour récupérer les dates des tests de l'utilisateur
  const getUserTestDates = async (userId) => {
    try {
      const userTestsRef = collection(db, "UserTests");
      const q = query(userTestsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map((doc) => doc.data().testDate);
      const sortedDates = dates.sort((a, b) => new Date(a) - new Date(b));
      setDate(sortedDates?.[0]);
      setTestDates(sortedDates);
    } catch (error) {
      console.error("Error fetching UserTest dates: ", error);
    }
  };

  const getUserLastTests = async (userId, filterDate = null) => {
    try {
      const userTestsRef = collection(db, "UserTests");
      let q = null;
      if (role === "candidate") {
        if (testDates?.[testDates?.length - 1]) {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("testDate", "==", testDates?.[testDates?.length - 1]),
            where("sharedState", "==", true)
          );
        } else {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("sharedState", "==", true)
          );
        }
      } else {
        if (testDates?.[testDates?.length - 1]) {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("testDate", "==", testDates?.[testDates?.length - 1])
          );
        } else {
          q = query(userTestsRef, where("userId", "==", userId));
        }
      }

      const querySnapshot = await getDocs(q);
      const userTests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (userTests?.length === 0) {
        return [];
      }

      /*       setTestData(userTests); */
      return userTests;
    } catch (error) {
      console.error("Error fetching UserTests: ", error);
      return [];
    }
  };
  const getUserTestsByUserId = async (userId, filterDate = null) => {
    try {
      const userTestsRef = collection(db, "UserTests");
      let q = null;
      if (role === "candidate") {
        if (date) {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("testDate", "==", date),
            where("sharedState", "==", true)
          );
        } else {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("sharedState", "==", true)
          );
        }
      } else {
        if (date) {
          q = query(
            userTestsRef,
            where("userId", "==", userId),
            where("testDate", "==", date)
          );
        } else {
          q = query(userTestsRef, where("userId", "==", userId));
        }
      }

      const querySnapshot = await getDocs(q);
      const userTests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (userTests?.length === 0) {
        return [];
      }

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
  const getUserLastTestsAndCategories = async (userId) => {
    try {
      setLoading(true);
      const userLastTests = await getUserLastTests(userId);
      const testsWithCategories = await Promise.all(
        userLastTests.map(async (userTest) => {
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

  function extraireAnnee(dateStr) {
    // Créer un objet Date à partir de la chaîne de caractères
    const dateObj = new Date(dateStr);
    // Extraire et retourner l'année
    return dateObj.getFullYear();
  }

  const fetchData = async () => {
    let period1 = [];
    let period2 = [];

    const result = await getUserTestsAndCategories(userId);
    if (result?.length === 0) return;
    const getResponsesByCategoryIdAndDate = (dataObj, categoryId) => {
      if (!!!dataObj) return;
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
        result.sharedDate = dataObj.sharedDate;
      }

      return result;
    };

    // Itération sur les ID pour obtenir les réponses
    period1 = categoryIds.reduce((acc, categoryId) => {
      const responses = getResponsesByCategoryIdAndDate(
        result?.[0],
        categoryId
      )?.responses;
      return acc.concat(responses || []);
    }, []);

    /* period 2 */

    const result2 = await getUserLastTestsAndCategories(userId);
    if (result2?.length === 0) return;
    const getResponsesByCategoryIdAndDate2 = (dataObj, categoryId) => {
      if (!!!dataObj) return;
      const result2 = {};
      // Trouve la catégorie spécifique par categoryId
      const category = dataObj.categories.find(
        (cat) => cat.category === categoryId
      );
      if (category) {
        // Extrait les réponses de la catégorie
        result2.responses = category.responses.map(
          (response) => response.response
        );
        result2.testId = dataObj.testId;
        result2.userId = dataObj.userId;
        result2.testDate = dataObj.testDate;
        result2.sharedState = dataObj.sharedState;
        result2.sharedDate = dataObj.sharedDate;
      }

      return result2;
    };

    // Itération sur les ID pour obtenir les réponses
    period2 = categoryIds.reduce((acc, categoryId) => {
      const responses = getResponsesByCategoryIdAndDate2(
        result2?.[0],
        categoryId
      )?.responses;
      return acc.concat(responses || []);
    }, []);

    // Ensure the combined data has the correct length
    const fullDataLength = labels.length;
    const fullData = Array(fullDataLength).fill(null);
    for (let i = 0; i < period1.length; i++) {
      fullData[i] = period1[i];
    }

    // Combine the new period data in the same way
    const fullNewPeriodData = Array(fullDataLength).fill(null);
    for (let i = 0; i < period2.length; i++) {
      fullNewPeriodData[i] = period2[i];
    }

    console.log(" *** fullNewPeriodData ***", result2?.[0]?.testDate);
    const annee = extraireAnnee(result2?.[0]?.testDate);

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
        {
          label: `Vous ${annee}`,
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
    getUserTestDates(userId);
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [userId, date, date2]);

  return { chartData, loading, testData, testDates, setDate, setDate2 }; // Return testDates to use in other components
};

export default UseChartData;
