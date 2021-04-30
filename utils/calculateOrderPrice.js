const calculateOrderPrice = (portraitStyle, portraitSize, fullBody) => {
    let price;
  
    if (portraitStyle === "line-art") {
      price = 35;
    } 
  
    if (portraitStyle === "manga-style") {
      price = 45;
    }

    if (portraitStyle === "realistic-digital") {
        price = 90;
    }
    
      if (portraitStyle === "character-design") {
        price = 30;
    }

    if (portraitStyle === "digital-oil-portrait") {
        price = 75;
    }
    

    if (portraitStyle === "landscapes-illustrations") {
        price = 50;
    }

    if(fullBody === 'true'){
        price = price + 15
    }

  
    
      if (portraitSize === "12/14") {
        price = price + 5;
    }

    if (portraitSize === "14/16") {
        price = price + 8;
    }
    

    if (portraitSize === "16/18") {
        price = price + 11;
    }

    return price;
  };
  
  module.exports = calculateOrderPrice;