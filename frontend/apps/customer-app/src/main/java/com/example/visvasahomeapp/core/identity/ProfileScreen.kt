package com.example.visvasahomeapp.core.identity

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.visvasahomeapp.shell.AuthViewModel
import com.example.visvasahomeapp.shell.UserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    userViewModel: UserViewModel,
    authViewModel: AuthViewModel,
    onBack: () -> Unit,
    onEditProfileClick: () -> Unit,
    onManageAddressesClick: () -> Unit,
    onNotificationsClick: () -> Unit,
    onWalletClick: () -> Unit,
    onAmcClick: () -> Unit,
    onLogout: () -> Unit
) {
    val user = authViewModel.userProfile
    val BrandBlue = Color(0xFF2563EB)
    val BgGray = Color(0xFFF8FAFC)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Account", fontWeight = FontWeight.Black) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null) }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        containerColor = BgGray
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier.padding(innerPadding).fillMaxSize()
        ) {
            // User Header
            item {
                Surface(color = Color.White, shadowElevation = 0.5.dp) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier.size(64.dp).clip(CircleShape).background(Color(0xFFF1F5F9)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(user.name.take(1), fontSize = 24.sp, fontWeight = FontWeight.Black, color = BrandBlue)
                        }
                        Spacer(Modifier.width(16.dp))
                        Column(Modifier.weight(1f)) {
                            Text(user.name, fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF111827))
                            Text("+91 ${user.phone}", color = Color.Gray, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                        IconButton(onClick = onEditProfileClick) {
                            Icon(Icons.Default.Edit, null, tint = BrandBlue, modifier = Modifier.size(20.dp))
                        }
                    }
                }
            }

            item { Spacer(Modifier.height(8.dp)) }

            // Primary Actions (Wallet, AMC)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    ProfileCard(
                        title = "Wallet",
                        subtitle = "₹450 Balance",
                        icon = Icons.Default.AccountBalanceWallet,
                        color = Color(0xFF2563EB),
                        onClick = onWalletClick,
                        modifier = Modifier.weight(1f)
                    )
                    ProfileCard(
                        title = "My AMC",
                        subtitle = "1 Active Plan",
                        icon = Icons.Default.Verified,
                        color = Color(0xFF059669),
                        onClick = onAmcClick,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            item { Spacer(Modifier.height(24.dp)) }

            // Menu Groups
            item { MenuSectionTitle("My Activity") }
            item { MenuItem(Icons.Default.ReceiptLong, "Booking History", onClick = { /* History already in bottom nav */ }) }
            item { MenuItem(Icons.Default.LocationOn, "Manage Addresses", onClick = onManageAddressesClick) }
            item { MenuItem(Icons.Default.Star, "My Reviews", onClick = {}) }

            item { Spacer(Modifier.height(16.dp)) }
            item { MenuSectionTitle("Settings & Support") }
            item { MenuItem(Icons.Default.Notifications, "Notifications", onClick = onNotificationsClick) }
            item { MenuItem(Icons.AutoMirrored.Filled.HelpOutline, "Help Center", onClick = {}) }
            item { MenuItem(Icons.Default.Info, "About VisvasaHome", onClick = {}) }

            item { Spacer(Modifier.height(32.dp)) }

            item {
                TextButton(
                    onClick = onLogout,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    colors = ButtonDefaults.textButtonColors(contentColor = Color(0xFFEF4444))
                ) {
                    Icon(Icons.Default.ExitToApp, null)
                    Spacer(Modifier.width(8.dp))
                    Text("Logout", fontWeight = FontWeight.Black)
                }
            }
            
            item { Spacer(Modifier.height(100.dp)) }
        }
    }
}

@Composable
fun ProfileCard(title: String, subtitle: String, icon: ImageVector, color: Color, onClick: () -> Unit, modifier: Modifier) {
    Card(
        modifier = modifier.height(100.dp),
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.SpaceBetween) {
            Icon(icon, null, tint = color, modifier = Modifier.size(24.dp))
            Column {
                Text(title, fontWeight = FontWeight.Black, fontSize = 14.sp)
                Text(subtitle, fontSize = 11.sp, color = color, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun MenuSectionTitle(title: String) {
    Text(
        title,
        fontWeight = FontWeight.Black,
        fontSize = 13.sp,
        color = Color.Gray,
        modifier = Modifier.padding(horizontal = 24.dp, vertical = 12.dp)
    )
}

@Composable
fun MenuItem(icon: ImageVector, label: String, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        color = Color.White
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(16.dp))
            Text(label, modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF334155))
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Color.LightGray)
        }
    }
}
