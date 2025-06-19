output "network" {
  value = google_compute_network.network.self_link
}

output "subnetwork" {
  value = google_compute_subnetwork.subnet.self_link
}



