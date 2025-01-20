import React from "react";
import { Box } from "@mui/material";
import Navbar from "../../components/LandingPage/Navbar";
import HeroSection from "../../components/LandingPage/HeroSection";
import About from "../../components/LandingPage/About";
import PastRecruiters from "../../components/LandingPage/PastRecruiter";
import Footer from "../../components/LandingPage/Footer";

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <HeroSection />
      <Box id="about">
        <About />
      </Box>
      <Box id="recruiters">
        <PastRecruiters />
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
