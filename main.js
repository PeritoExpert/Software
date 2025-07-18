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
        'vehicleMotor'
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
    
    // Mostrar resumen
    document.getElementById('summary').style.display = 'block';
    nextSection(14);

setTimeout(() => {
        window.print();
    }, 100);
    function preparePrint() {
    // Asegurarse que el resumen está visible
    document.getElementById('summary').style.display = 'block';
    nextSection(14);
    
    // Esperar un momento para que el navegador renderice los cambios
    setTimeout(() => {
        // Ocultar botones antes de imprimir
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => btn.style.display = 'none');
        
        window.print();
        
        // Restaurar botones después de imprimir
        setTimeout(() => {
            buttons.forEach(btn => btn.style.display = '');
        }, 500);
    }, 200);
    function preparePrint() {
    // Guardar los estilos originales
    const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    
    // Crear estilo específico para impresión
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
            }
            #summary, #summary * {
                visibility: visible;
            }
            #summary {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
            }
            .btn {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
    
    // Imprimir
    window.print();
    
    // Limpiar después de imprimir
    setTimeout(() => {
        document.head.removeChild(printStyle);
    }, 1000);
}function preparePrint() {
    document.getElementById('summary').style.display = 'block';
    nextSection(14);
    setTimeout(() => window.print(), 300);
}
}
}
