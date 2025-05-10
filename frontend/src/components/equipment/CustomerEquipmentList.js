import React, { useEffect, useContext, useState } from 'react';
import EquipmentContext from '../../contexts/equipment/equipmentContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import { Search, FitnessCenter, Build, Clear } from '@mui/icons-material';

const CustomerEquipmentList = () => {
  const equipmentContext = useContext(EquipmentContext);
  const { equipment, loading, error, getCustomerEquipment } = equipmentContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    getCustomerEquipment();
    // eslint-disable-next-line
  }, []);
  
  // Filter equipment based on search term
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group equipment by type
  const groupedEquipment = filteredEquipment.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h2">
            Thiết bị phòng tập
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Tìm kiếm thiết bị theo tên, loại, mô tả hoặc vị trí..."
          variant="outlined"
          sx={{ mb: 3 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Clear 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSearchTerm('')}
                />
              </InputAdornment>
            ),
          }}
        />
        
        {filteredEquipment.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4 }}>
            Không tìm thấy thiết bị
          </Typography>
        ) : (
          <>
            {Object.keys(groupedEquipment).map(type => (
              <Box key={type} sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Build sx={{ mr: 1 }} />
                  {type}
                </Typography>
                
                <Grid container spacing={3}>
                  {groupedEquipment[type].map(item => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {item.image ? (
                          <CardMedia
                            component="img"
                            image={`http://localhost:5000${item.image}`}
                            alt={item.name}
                            height={200}
                            sx={{ objectFit: 'contain', p: 2 }}
                          />
                        ) : (
                          <Box 
                            sx={{ 
                              height: 200, 
                              bgcolor: '#f5f5f5', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <FitnessCenter sx={{ fontSize: 60, color: 'text.secondary' }} />
                          </Box>
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3" gutterBottom>
                            {item.name}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          {item.description && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.description}
                            </Typography>
                          )}
                          {item.location && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              <strong>Vị trí:</strong> {item.location}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CustomerEquipmentList;