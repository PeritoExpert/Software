 // Contador de peritajes
    let peritajesCount = localStorage.getItem('peritajesCount') || 0;
    document.getElementById('peritajesCount').textContent = peritajesCount;
    
    function incrementPeritajes() {
      peritajesCount++;
      localStorage.setItem('peritajesCount', peritajesCount);
      document.getElementById('peritajesCount').textContent = peritajesCount;
    }

    // Navegación entre secciones
    let currentSection = 1;
    const totalSections = 13; // Actualizado a 13 secciones
    
    function updateProgressBar() {
      const progress = (currentSection / totalSections) * 100;
      document.getElementById('progressBar').style.width = `${progress}%`;
    }
    
    function nextSection(section) {
      document.getElementById(`section-${currentSection}`).classList.remove('active');
      currentSection = section;
      document.getElementById(`section-${currentSection}`).classList.add('active');
      updateProgressBar();
      
      // Scroll to top of section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Pesos de las secciones
    const sectionWeights = {
      1: 0,   // Datos del vehículo (no se califica)
      2: 10,  // Documentación
      3: 5,   // Valores Comerciales
      4: 10,  // Fuga de fluidos
      5: 15,  // Sistema Eléctrico (incluye compresión)
      6: 15,  // Inspección Visual y Técnica
      7: 10,  // Amortiguadores (solo amortiguadores)
      8: 5,   // Llantas
      9: 10,  // Tren Delantero y suspensión (sin amortiguadores)
      10: 5,  // Interior del vehículo
      11: 5,  // Accesorios
      12: 10, // Prueba de ruta
      13: 0   // Observaciones (no se califica)
    };

    function evaluateSection(sectionId) {
      const section = document.getElementById(`section-${sectionId}`);
      const inputs = section.querySelectorAll('select, input[type="number"]');
      let score = 0;
      let total = 0;
      
      inputs.forEach(input => {
        if (input.type === 'number') {
          // Evaluar compresión de motor (considerar bueno si > 100 PSI)
          if (input.value && !isNaN(input.value)) {
            total++;
            const psi = parseInt(input.value);
            if (psi > 100) score += 100;
            else if (psi > 80) score += 65;
            else score += 10;
          }
        } else {
          // Evaluación normal para selects
          const value = input.value;
          if (value && value !== "N/A") {
            total++;
            switch(value) {
              case "Bueno": score += 100; break;
              case "Regular": score += 65; break;
              case "Malo": score += 10; break;
              case "Sí": 
                if (input.id.includes('Leak')) score += 0;
                else score += 100;
                break;
              case "No":
                if (input.id.includes('Leak')) score += 100;
                else score += 0;
                break;
            }
          }
        }
      });
      
      return {
        percentage: total > 0 ? (score / total) : 0,
        name: getSectionName(sectionId)
      };
    }

    function getSectionName(sectionId) {
      const names = {
        1: "Datos del Vehículo",
        2: "Documentación",
        3: "Valores Comerciales",
        4: "Fuga de fluidos",
        5: "Sistema Eléctrico y Compresión",
        6: "Inspección Visual y Técnica",
        7: "Amortiguadores",
        8: "Llantas",
        9: "Tren Delantero y Suspensión",
        10: "Interior del vehículo",
        11: "Accesorios",
        12: "Prueba de ruta",
        13: "Observaciones del Perito"
      };
      return names[sectionId] || `Sección ${sectionId}`;
    }

    function calculateGlobalScore(sectionScores) {
      let totalWeight = 0;
      let weightedSum = 0;
      
      for (const [sectionId, score] of Object.entries(sectionScores)) {
        const weight = sectionWeights[sectionId] || 0;
        if (weight > 0) {
          weightedSum += score.percentage * weight;
          totalWeight += weight;
        }
      }
      
      return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    function generateSummary() {
      incrementPeritajes();
      
      // Recopilar datos de todas las secciones
      const sectionScores = {};
      for (let i = 1; i <= totalSections; i++) {
        sectionScores[i] = evaluateSection(i);
      }
      
      // Calcular puntaje global
      const globalScore = calculateGlobalScore(sectionScores);
      const passed = globalScore >= 75;
      
      // Actualizar datos del vehículo en el resumen
      const fields = [
        'vehicleClass', 'vehicleBrand', 'vehicleLine', 'vehicleBody', 
        'vehicleModel', 'vehicleNationality', 'vehicleTransmission', 
        'vehicleEngine', 'vehicleFuel', 'vehiclePaint', 'vehicleService', 
        'vehicleMileage', 'vehicleColor', 'vehicleChassis', 'vehicleSerial', 
        'vehicleMotor',
        'piston1Compression', 'piston2Compression', 'piston3Compression', 'piston4Compression'
      ];
      
      fields.forEach(field => {
        const element = document.getElementById(field);
        const summaryElement = document.getElementById(`${field}Summary`);
        if (element && summaryElement) {
          summaryElement.textContent = element.value || 'N/A';
        }
      });
      
      // Actualizar documentación
      document.getElementById('soatSummary').textContent = document.getElementById('soat').value || 'N/A';
      document.getElementById('propertyCardSummary').textContent = document.getElementById('propertyCard').value || 'N/A';
      document.getElementById('accidentsReportedSummary').textContent = document.getElementById('accidentsReported').value || 'N/A';
      document.getElementById('claimValueSummary').textContent = document.getElementById('claimValue').value ? '$' + document.getElementById('claimValue').value : 'N/A';
      document.getElementById('techReviewSummary').textContent = document.getElementById('techReview').value || 'N/A';
      document.getElementById('insuranceCompanySummary').textContent = document.getElementById('insuranceCompany').value || 'N/A';
      
      // Actualizar valores comerciales
      document.getElementById('marketValueSummary').textContent = document.getElementById('marketValue').value ? '$' + document.getElementById('marketValue').value : 'N/A';
      document.getElementById('fasecoldaValueSummary').textContent = document.getElementById('fasecoldaValue').value ? '$' + document.getElementById('fasecoldaValue').value : 'N/A';
      document.getElementById('marketPriceSummary').textContent = document.getElementById('marketPrice').value ? '$' + document.getElementById('marketPrice').value : 'N/A';
      document.getElementById('depreciationValueSummary').textContent = document.getElementById('depreciationValue').value ? '$' + document.getElementById('depreciationValue').value : 'N/A';
      document.getElementById('expertValueSummary').textContent = document.getElementById('expertValue').value ? '$' + document.getElementById('expertValue').value : 'N/A';
      document.getElementById('accessoriesValueSummary').textContent = document.getElementById('accessoriesValue').value ? '$' + document.getElementById('accessoriesValue').value : 'N/A';
      
      // Actualizar resultados detallados de cada sección
      for (let i = 4; i <= 12; i++) {
        const section = document.getElementById(`section-${i}`);
        const inputs = section.querySelectorAll('select');
        
        inputs.forEach(input => {
          const summaryElement = document.getElementById(`${input.id}Summary`);
          if (summaryElement) {
            summaryElement.textContent = input.value || 'N/A';
          }
        });
        
        // Actualizar porcentaje de cada sección
        const percentageElement = document.getElementById(`section${i}Percentage`);
        if (percentageElement) {
          percentageElement.textContent = sectionScores[i].percentage.toFixed(2);
        }
      }
      
      // Actualizar observaciones
      document.getElementById('peritoObservations').textContent = document.getElementById('observations').value || 'Ninguna observación registrada.';
      
      // Mostrar acciones recomendadas
      const actionsContainer = document.getElementById('recommendedActions');
      actionsContainer.innerHTML = '';
      
      const actionCheckboxes = document.querySelectorAll('input[name="actions"]:checked');
      if (actionCheckboxes.length > 0) {
        actionCheckboxes.forEach(checkbox => {
          const actionItem = document.createElement('p');
          actionItem.textContent = checkbox.value;
          actionsContainer.appendChild(actionItem);
        });
      } else {
        actionsContainer.innerHTML = '<p>No se marcaron acciones recomendadas.</p>';
      }
      
      // Actualizar porcentaje global
      const globalCircle = document.querySelector('.global-circle');
      globalCircle.style.setProperty('--percentage', globalScore.toFixed(2));
      document.getElementById('globalPercentage').textContent = `${globalScore.toFixed(2)}%`;
      
      // Mostrar resultado final
      const finalResult = document.getElementById('finalResult');
      finalResult.textContent = passed ? 'APROBADO' : 'NO APROBADO';
      
      const finalResultBox = document.getElementById('finalResultBox');
      finalResultBox.className = passed ? 'final-result passed' : 'final-result failed';
      
      // Mostrar resumen y ocultar formulario
      document.getElementById('summary').style.display = 'block';
      
      // Ocultar todas las secciones del formulario
      document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Scroll al inicio del resumen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function insertImage() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
          const imagesContainer = document.createElement('div');
          imagesContainer.style.display = 'grid';
          imagesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
          imagesContainer.style.gap = '10px';
          imagesContainer.style.marginTop = '20px';
          
          Array.from(files).forEach(file => {
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.borderRadius = '6px';
                img.style.border = '1px solid var(--f1-gray)';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.style.position = 'absolute';
                deleteBtn.style.top = '5px';
                deleteBtn.style.right = '5px';
                deleteBtn.style.background = 'var(--f1-red)';
                deleteBtn.style.color = 'white';
                deleteBtn.style.border = 'none';
                deleteBtn.style.borderRadius = '50%';
                deleteBtn.style.width = '25px';
                deleteBtn.style.height = '25px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.onclick = () => imgContainer.remove();
                
                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                imagesContainer.appendChild(imgContainer);
              };
              reader.readAsDataURL(file);
            }
          });
          
          document.querySelector('.actions').before(imagesContainer);
        }
      };
      input.click();
    }
    function resetForm() {
  if (confirm('¿Está seguro que desea comenzar una nueva evaluación? Todos los datos actuales se perderán.')) {
    document.getElementById('evaluationForm').reset();
    document.getElementById('summary').style.display = 'none';
    
    // Mostrar el formulario nuevamente
    document.querySelectorAll('.form-section').forEach(section => {
      section.style.display = 'block';
    });
    
    // Volver a la primera sección
    document.querySelectorAll('.form-section').forEach(section => {
      section.classList.remove('active');
    });
    currentSection = 1;
    document.getElementById('section-1').classList.add('active');
    updateProgressBar();
    
    // Limpiar imágenes si hay
    const imagesContainers = document.querySelectorAll('#summary > div[style*="grid-template-columns"]');
    imagesContainers.forEach(container => container.remove());
  }
}
    

    // Inicializar barra de progreso
    updateProgressBar();
