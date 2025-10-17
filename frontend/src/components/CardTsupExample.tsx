import React from 'react';
import styled from 'styled-components';
import CardTsup from './CardTsup';

const CardTsupExample: React.FC = () => {
  return (
    <StyledContainer>
      <h2>Примеры карточек CardTsup</h2>
      
      <div className="cards-grid">
        <CardTsup width="300px" height="200px">
          <div className="card-content">
            <h3>Карточка 1</h3>
            <p>Содержимое карточки с анимированным фоном</p>
          </div>
        </CardTsup>

        <CardTsup width="400px" height="300px">
          <div className="card-content">
            <h3>Карточка 2</h3>
            <p>Большая карточка с плавающими точками</p>
            <button className="demo-button">Кнопка</button>
          </div>
        </CardTsup>

        <CardTsup width="250px" height="150px">
          <div className="card-content">
            <h3>Компактная</h3>
            <p>Маленькая карточка</p>
          </div>
        </CardTsup>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
  min-height: 100vh;
  color: white;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #00eaff;
    font-size: 2rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card-content {
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    h3 {
      color: #00eaff;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .demo-button {
      background: linear-gradient(135deg, #00eaff, #3c67e3);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 234, 255, 0.3);
      }
    }
  }
`;

export default CardTsupExample;
