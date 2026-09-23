package com.example.visvasahomeapp.features.search

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.visvasahomeapp.model.ServiceCategory
import com.example.visvasahomeapp.model.mockServiceInventory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    onBack: () -> Unit,
    onCategoryClick: (ServiceCategory) -> Unit
) {
    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }
    val keyboard = LocalSoftwareKeyboardController.current

    val BrandBlue = Color(0xFF2563EB)

    val recentSearches = remember {
        mutableStateListOf("AC repair", "Salon", "Plumbing")
    }

    // Live search - search categories AND specific items
    val filteredResults = remember(query) {
        if (query.isBlank()) emptyList()
        else {
            val cats = ServiceCategory.entries.filter { 
                it.displayName.contains(query, ignoreCase = true) 
            }.map { it to "Category" }
            
            val items = mockServiceInventory.filter { 
                it.name.contains(query, ignoreCase = true) 
            }.map { it to "Service" }
            
            (cats + items)
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Search Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.Black)
            }
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF3F4F6))
                    .padding(horizontal = 12.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Search, null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(10.dp))
                    androidx.compose.foundation.text.BasicTextField(
                        value = query,
                        onValueChange = { query = it },
                        modifier = Modifier.fillMaxWidth().focusRequester(focusRequester),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                        keyboardActions = KeyboardActions(onSearch = { 
                            if (query.isNotBlank() && !recentSearches.contains(query)) {
                                recentSearches.add(0, query)
                            }
                            keyboard?.hide() 
                        }),
                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 15.sp, fontWeight = FontWeight.Medium),
                        decorationBox = { inner ->
                            if (query.isEmpty()) Text("Search for services...", color = Color.Gray, fontSize = 15.sp)
                            inner()
                        }
                    )
                }
            }
            if (query.isNotEmpty()) {
                IconButton(onClick = { query = "" }) {
                    Icon(Icons.Default.Close, null, tint = Color.Gray, modifier = Modifier.size(20.dp))
                }
            }
        }

        Divider(color = Color(0xFFF1F5F9))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            if (query.isBlank()) {
                // Initial State: Recent & Popular
                if (recentSearches.isNotEmpty()) {
                    item {
                        Text("Recent Searches", fontWeight = FontWeight.Black, fontSize = 14.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 12.dp))
                    }
                    items(recentSearches) { search ->
                        Row(
                            Modifier.fillMaxWidth().clickable { query = search }.padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.History, null, tint = Color.LightGray, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(16.dp))
                            Text(search, fontSize = 15.sp, color = Color(0xFF334155))
                            Spacer(Modifier.weight(1f))
                            Icon(Icons.Default.NorthWest, null, tint = Color.LightGray, modifier = Modifier.size(14.dp))
                        }
                    }
                }

                item { Spacer(Modifier.height(24.dp)) }

                item {
                    Text("Popular Categories", fontWeight = FontWeight.Black, fontSize = 14.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 16.dp))
                }
                
                items(ServiceCategory.entries.filter { it != ServiceCategory.CART }.chunked(2)) { pair ->
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        pair.forEach { cat ->
                            Surface(
                                onClick = { onCategoryClick(cat) },
                                modifier = Modifier.weight(1f).height(44.dp),
                                shape = RoundedCornerShape(10.dp),
                                color = Color(0xFFF8FAFC),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9))
                            ) {
                                Row(Modifier.padding(horizontal = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Text(cat.displayName.replace("\n", " "), fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF334155))
                                }
                            }
                        }
                        if (pair.size == 1) Spacer(Modifier.weight(1f))
                    }
                    Spacer(Modifier.height(12.dp))
                }
            } else {
                // Results State
                item {
                    Text("Searching for \"$query\"", fontSize = 13.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 16.dp))
                }

                if (filteredResults.isEmpty()) {
                    item {
                        Box(Modifier.fillMaxWidth().padding(top = 60.dp), contentAlignment = Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🔍", fontSize = 40.sp)
                                Spacer(Modifier.height(16.dp))
                                Text("No services found", fontWeight = FontWeight.Black, color = Color.Gray)
                                Text("Try searching for 'AC' or 'Salon'", fontSize = 13.sp, color = Color.LightGray)
                            }
                        }
                    }
                } else {
                    items(filteredResults) { result ->
                        val (data, type) = result
                        Row(
                            Modifier.fillMaxWidth().clickable { 
                                if (data is ServiceCategory) onCategoryClick(data)
                                // Handle service item click if needed
                            }.padding(vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val icon = if (type == "Category") Icons.Default.Category else Icons.Default.Handyman
                            Box(Modifier.size(36.dp).clip(RoundedCornerShape(8.dp)).background(Color(0xFFF1F5F9)), contentAlignment = Alignment.Center) {
                                Icon(icon, null, tint = BrandBlue, modifier = Modifier.size(18.dp))
                            }
                            Spacer(Modifier.width(16.dp))
                            Column {
                                val name = if (data is ServiceCategory) data.displayName.replace("\n", " ") else (data as com.example.visvasahomeapp.model.ServiceItem).name
                                Text(name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF1E293B))
                                Text(type, fontSize = 12.sp, color = Color.Gray)
                            }
                            Spacer(Modifier.weight(1f))
                            Icon(Icons.Default.ChevronRight, null, tint = Color.LightGray)
                        }
                        Divider(color = Color(0xFFF8FAFC))
                    }
                }
            }
        }
    }
}
