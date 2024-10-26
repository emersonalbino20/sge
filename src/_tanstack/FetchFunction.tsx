import * as React from 'react'
import { useQuery } from '@tanstack/react-query';

export default function fetchAlunos() {
    return fetch(`http://localhost:8000/api/alunos/`).then(response => response.json());
  }
  